<?php

/*

    Copyright 2017 Aniket Bhadane (aniketbhadane93@gmail.com)

    This file is part of Taasika - A Timetable generation software.

    Taasika is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Taasika is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Taasika.  If not, see <http://www.gnu.org/licenses/>.

*/

/*
 *  File: automate.php
 *
 *  Author: Aniket Bhadane (aniketbhadane93@gmail.com)
 *
 *	Description: 
 *  Prepares an automated timetable using a genetic-like algoritm. 
 *  The program expects 'currentSnapshotId' to be received as POST/GET argument.
 *  If it does not receive 'currentSnapshotId', 
 *  it assumes snapshotId to be 1 (which is default snapshot)
*/

/*
    Curl is used to call saveNewSnapshot function defined in snapshot.php
    If using XAMPP, uncomment (remove semicolon) on this line:
    ;extension=php_curl.dll
    in file C:\xampp\php\php.ini
    Then restart Apache service
*/


require_once('db.php');

$conn = dbConnect();

// 
//  Change these parameters to match your needs 
//

$POPSIZE = 50;      // number of timetables (population size) in a generation
$MAXGENS = 20;      // MAXGENS is maximum number of iterations
$PXOVER = 0.8;      // maximum probability value for a crossover to occur

$weight = array();                      // weights for constraints' violations
$weight["Overlaps"] = 100000000;        // no overlaps
$weight["Lunch"] = 15;                  // no lunch in a day
$weight["Multiple_Lectures"] = 300;     // multiple lectures of same subject in a day
$weight["Class_Room"] = 20;             // class not having same room in a day
$weight["Teacher_Workload"] = 10;       // teacher not having minimum workload
$weight["Compact"] = 12;                // timetable not being compact
    

    
$population = array();
$fitness = array();


$snapshotId = getArgument("currentSnapshotId");

if(empty($snapshotId))  // if currentSnapshotId is not passed
    $snapshotId = 1;    // consider default snapshot

// fetch configId
$temp = fetch("SELECT * FROM snapshot WHERE snapshotId = $snapshotId");
$configId = $temp[0]["configId"];

// fetch nSlots from config
$temp = fetch("SELECT * FROM config WHERE configId = $configId");
$config_nSlots = $temp[0]["nSlots"];

$ndays = 5;

$rooms = fetch("SELECT * FROM room WHERE snapshotId = $snapshotId");

$teachers = fetch("SELECT * FROM teacher WHERE snapshotId = $snapshotId");

$classes = fetch("SELECT * FROM class WHERE snapshotId = $snapshotId");

$batches = fetch("SELECT * FROM batch WHERE snapshotId = $snapshotId");

$batchclass = fetch("SELECT * FROM batchclass WHERE snapshotId = $snapshotId");

// create distinct sets of batches referring to batchcanoverlap
$batch_sets = create_batch_sets();

// create distinct sets of overlappingsbt
$overlappingsbt_sets = create_overlappingsbt_sets();

//
// Create the entries array
//

$entries = array();

createEntries();

echo "<br/>To Schedule " . count($entries) . " entries:<br/>";
for ($i=0; $i < count($entries); $i++) { 
    print_r($entries[$i]);
    echo "<br/>";
}


//
//  Algorithm starts
//

initialize();

repair();

evaluate();

for ( $generation = 0; $generation < $MAXGENS; $generation++ )  { 

    echo "<br/><br/>Generation " . ($generation+1);

    selector(); 
    
    crossover(); 

    repair();

    evaluate();
}

/*
//
//  Create New Snapshot
//

while sending data to saveNewSnapshot, json_encode timetable data, 'ttData' => json_encode($timeTable)
What to do of fixed entries? Maybe make lunch entries as fixed entries, also json_encode these


echo "<br/>Creating New Snapshot...";

// Initialize curl object
$ch = curl_init();

// Create post data
$data = array(
    'reqType' => saveNewSnapshot,
    'newSnapshotName' => $newSnapshotName,
    'currentSnapshotName' => $currentSnapshotName,
    'configId' => $currentConfigId,
    'ttData' => $timeTable,
    'feData' => $fixedEntry
);

// Set curl options
curl_setopt_array($ch, array(
    CURLOPT_RETURNTRANSFER => 1, // Return information from server
    CURLOPT_URL => 'snapshot.php',
    CURLOPT_POST => 1, // Normal HTTP post 
    CURLOPT_POSTFIELDS => $data
));

// Execute curl and return result to $response
$response = curl_exec($ch);

echo "<br/>Save Snapshot response: $response";

// Close request
curl_close($ch);


echo "<br/><br/>Program Complete.";

*/

//
//  Function definitions of the functions used in the program starts here
//

function fetch($query) {
    global $conn;     
    //echo $query . "<br/>";
    $results = $conn->query($query);
    if($conn->error or $results === FALSE)
        die("Could not execute $query " . $conn->error. $results);
    while($rows[] = mysqli_fetch_assoc($results));
    array_pop($rows); // remove last empty entry
    return $rows;
}


function create_batch_sets() {

    global $conn;
    global $snapshotId;

    // get all batchIds

    $batchcanoverlapIds = fetch("SELECT batchId FROM batchclass WHERE snapshotId = $snapshotId");

    $batchIds = array();

    for ($i = 0 ; $i < count($batchcanoverlapIds) ; $i++) {
            $batchIds[] = $batchcanoverlapIds[$i]["batchId"];
    }

    $batch_sets = array();

    for ($i = 0 ; $i < count($batchIds) ; $i++)  {

        $set = array();

        //if $batchIds[i] does not exist in batch_sets 
        
        if(search($batchIds[$i], $batch_sets) == -1) {
        
            //fetch the batchoverlapids from batchcanoverlap
            
            $batchOverlapIds = fetch("SELECT batchOverlapId FROM batchcanoverlap 
                WHERE batchId = $batchIds[$i] AND snapshotId = $snapshotId");

            $set[] = $batchIds[$i];

            for($j = 0 ; $j < count($batchOverlapIds) ; $j++) {
                $set[] = $batchOverlapIds[$j]["batchOverlapId"];
            }

            $batch_sets[] = $set;

        }

    }

    return $batch_sets;
    
}

function create_overlappingsbt_sets() {

    global $conn;
    global $snapshotId;

    // get all sbtId1

    $sbtId1_temp = fetch("SELECT sbtId1 FROM overlappingsbt WHERE snapshotId = $snapshotId");

    $sbtId1 = array();

    for ($i = 0 ; $i < count($sbtId1_temp) ; $i++) {
            $sbtId1[] = $sbtId1_temp[$i]["sbtId1"];
    }

    $overlappingsbt_sets = array();

    for ($i = 0 ; $i < count($sbtId1) ; $i++)  {

        $set = array();

        // if $sbtId1[i] does not exist already in overlappingsbt_sets 
        
        if(search($sbtId1[$i], $overlappingsbt_sets) == -1) {
        
            //fetch the batchoverlapids from batchcanoverlap
            
            $sbtId2 = fetch("SELECT sbtId2 FROM overlappingsbt 
                WHERE sbtId1 = $sbtId1[$i] AND snapshotId = $snapshotId");

            $set[] = $sbtId1[$i];

            for($j = 0 ; $j < count($sbtId2) ; $j++) {
                $set[] = $sbtId2[$j]["sbtId2"];
            }

            $overlappingsbt_sets[] = $set;

        }

    }

    return $overlappingsbt_sets;
}

// search in 2D array

function search($array, $val) {

    for($i = 0 ; $i < count($array) ; $i++) {

        for($j = 0 ; $j < count($array[$i]) ; $j++) {

            if($array[$i][$j] == $val)
                return 1;
        }

    }

    return -1;
}

function createEntries() {

    global $snapshotId;
    global $entries;

    $subjects = fetch("SELECT * FROM subject WHERE snapshotId = $snapshotId");

    for ($i=0; $i < count($subjects); $i++) { 

        // entry: sid tid cid bid eachslot nslots  
        // ( cid=-1 if subject scheduled in batch, bid=-1 if not a batch )

        $sId = $subjects[$i]["subjectId"];

        $eachSlot = $subjects[$i]["eachSlot"];

        $nSlots = $subjects[$i]["nSlots"];

        if($subjects[$i]["batches"] == 1) {

            $temp = fetch("SELECT * FROM subjectbatchteacher WHERE subjectId = $sId");

            for ($j=0; $j < count($temp); $j++) { 
                
                $cId = -1;
                $bId = $temp[$j]["batchId"];
                $tId = $temp[$j]["teacherId"];

                $entry = array("sId" => $sId, "tId" => $tId, "cId" => $cId, "bId" => $bId, 
                    "eachSlot" => $eachSlot, "nSlots" => $nSlots);

                array_push($entries, $entry);
            }
        }
        else {
            
            $temp = fetch("SELECT * FROM subjectclassteacher WHERE subjectId = $sId");

            for ($j=0; $j < count($temp); $j++) { 
                
                $cId = $temp[$j]["classId"];
                $bId = -1;
                $tId = $temp[$j]["teacherId"];

                $entry = array("sId" => $sId, "tId" => $tId, "cId" => $cId, "bId" => $bId, 
                    "eachSlot" => $eachSlot, "nSlots" => $nSlots);

                array_push($entries, $entry);
            }
        }    
        
    }
}

function initialize() {

    global $population;
    global $fitness;
    global $entries;
    global $config_nSlots;
    global $ndays;
    global $rooms;
    global $classes;
    global $batches;
    global $snapshotId;
    global $conn;
    global $POPSIZE;

    echo "<br/>Initializing...";

    $subjectroom = fetch("SELECT * FROM subjectroom WHERE snapshotId = $snapshotId");
    $classroom = fetch("SELECT * FROM classroom WHERE snapshotId = $snapshotId");
    $batchroom = fetch("SELECT * FROM batchroom WHERE snapshotId = $snapshotId");

    for ( $i = 0; $i < $POPSIZE; $i++ ) {

        $rooms3d = array(); $teachers3d = array(); $classes3d = array(); $batches3d = array();

        // initialize 3d arrays to NULL
        initNULL($rooms3d, $teachers3d, $clssses3d, $batches3d);

        for ( $j = 0; $j < count($entries); $j++) { 

            for ( $m = 0 ; $m < $entries[$j]["nSlots"] ; $m++) {

                $rId = searchRoom($subjectroom, "subjectId", $entries[$j]["sId"]);

                $tId = $entries[$j]["tId"];

                $eachSlot = $entries[$j]["eachSlot"];

                $day = mt_rand(1, $ndays);
                $slot = mt_rand(1, $config_nSlots - $eachSlot + 1);

                if($entries[$j]["bId"] == -1) { // not batch, so a class

                    $cId = $entries[$j]["cId"];

                    if($rId == -1)
                        $rId = searchRoom($classroom, "classId", $entries[$j]["cId"]);

                    if($rId == -1) {

                        for ($t=0; $t < count($classes); $t++) { 
                            if($classes[$t]["classId"] == $cId)
                                $min_capacity = $classes[$t]["classCount"];
                        }

                        // find random room with enough capacity

                        $rId = getRandomRoom($min_capacity); 
                    }

                    for ( $k = 0; $k < $eachSlot; $k++) { 

                        // storing index of entry

                        // ******** should be push $j, multiple entries can get same r d s, 
                        // so have array, otherwise new entry will replace earlier 

                        $rooms3d[$rId][$day][$slot + $k] = $j;
                        $teachers3d[$tId][$day][$slot + $k] = $j;
                        $classes3d[$cId][$day][$slot + $k] = $j;
                    }
                }
                else { // batch

                    $bId = $entries[$j]["bId"];

                    if($rId == -1)
                        $rId = searchRoom($batchroom, "batchId", $entries[$j]["bId"]);

                    if($rId == -1) {

                        for ($t=0; $t < count($batches); $t++) { 
                            if($batches[$t]["batchId"] == $bId)
                                $min_capacity = $batches[$t]["batchCount"];
                        }

                        // find random room with enough capacity

                        $rId = getRandomRoom($min_capacity); 
                    }

                    for ( $k = 0; $k < $eachSlot; $k++) { 

                        // storing index of entry

                        // ******** should be push $j, multiple entries can get same r d s, 
                        // so have array, otherwise new entry will replace earlier 

                        $rooms3d[$rId][$day][$slot + $k] = $j;
                        $teachers3d[$tId][$day][$slot + $k] = $j;
                        $batches3d[$bId][$day][$slot + $k] = $j;
                    }
                }

            }

        }

        $population[$i] = array("rooms3d" => $rooms3d, "teachers3d" => $teachers3d, 
                                "classes3d" => $classes3d, "batches3d" => $batches3d);

        $fitness[$i] = PHP_INT_MAX;
    }

    echo "done";

}

function initNULL(&$rooms3d, &$teachers3d, &$clssses3d, &$batches3d) {

    global $rooms;
    global $teachers;
    global $classes;
    global $batches;

    global $ndays;
    global $config_nSlots;

    foreach ($rooms as $room) {
        for ($day=1; $day <= $ndays; $day++) { 
            for ($slot=1; $slot <= $config_nSlots; $slot++) {
                $rooms3d[$room["roomId"]][$day][$slot] = NULL;
            }
        }
    }

    foreach ($teachers as $teacher) {
        for ($day=1; $day <= $ndays; $day++) { 
            for ($slot=1; $slot <= $config_nSlots; $slot++) {
                $teachers3d[$teacher["teacherId"]][$day][$slot] = NULL;
            }
        }
    }

    foreach ($classes as $class) {
        for ($day=1; $day <= $ndays; $day++) { 
            for ($slot=1; $slot <= $config_nSlots; $slot++) {
                $classes3d[$class["classId"]][$day][$slot] = NULL;
            }
        }
    }

    foreach ($batches as $batch) {
        for ($day=1; $day <= $ndays; $day++) { 
            for ($slot=1; $slot <= $config_nSlots; $slot++) {
                $batches3d[$batch["batchId"]][$day][$slot] = NULL;
            }
        }
    }

}


// check whether subject-room mapping / class-room mapping / batch-room mapping 
// for particular subject/class/batch exists.
// parameters: array - tablename, field - db column name (subjectId/classId/batchId), 
// id - id of particular subject/class/batch

function searchRoom($array, $field, $id) {

    foreach ($array as $row) {
        
        if($row[$field] == $id)
            return $row["roomId"];
    }

    /*
    for ($i=0; $i < count($array); $i++) { 
        
        if($array[$i][$field] == $id)
            return $array[$i]["roomId"];
    }
    */

    return -1;
}


// get random room with capacity more than min_capacity

function getRandomRoom($min_capacity) {

    global $rooms;

    $array = array();

    foreach ($rooms as $room) {
        if($room["roomCount"] >= $min_capacity)
            array_push($array, $room["roomId"]);
    }

    /*
    for ($i=0; $i < count($rooms); $i++) { 
            
        if($rooms[$i]["roomCount"] >= $min_capacity)
            array_push($array, $rooms[$i]["roomId"]);
    }
    */

    //$k = array_rand($array);
    //return $array[$k];

    return $array[mt_rand(0, count($array) - 1)];

}


function selector() {

    global $population;
    global $fitness;
    global $POPSIZE;

    /*
    Reproduction (or selection) is an operator that makes more copies of better timetables 
    in a new population.
    Reproduction SELECTS good timetables in a population and forms a mating pool. 
    This is one of the reason for the reproduction operation to be sometimes known 
    as the selection operator.
    The above average timetables are picked from the current population and their multiple copies
    are inserted in the new population in a probabilistic manner.
    */

    // Standard proportional selection for maximization problems.
    // Also makes sure that the best member always survives, population[POPSIZE] is untouched

    echo "<br/>Selector...";

    $newpopulation = array();

    // required for maximization process
    $rfitness = array();
    $cfitness = array();

    // best tt has minimum fitness value, but for the maximization process best tt requires 
    // highest fitness value
    // hence calculating inverse values, so least fitness will become highest fitness
    
    $inv_fitness = array();

    for ( $mem = 0; $mem < $POPSIZE; $mem++ )  {

        if($fitness[$mem] == 0)
            $inv_fitness[$mem] = 1;
        else
            $inv_fitness[$mem] =  1 / $fitness[$mem];
    }

    //
    //  Find the total fitness of the population.
    //
    $sum = 0.0;
    for ( $mem = 0; $mem < $POPSIZE; $mem++ ) {
        $sum = $sum + $inv_fitness[$mem];
    }
    
    //
    //  Calculate the relative fitness of each member.
    //
    for ( $mem = 0; $mem < $POPSIZE; $mem++ ) {
        $rfitness[$mem] = $inv_fitness[$mem] / $sum;
    }
    
    // 
    //  Calculate the cumulative fitness.
    //
    $cfitness[0] = $rfitness[0];
    for ( $mem = 1; $mem < $POPSIZE; $mem++ ) {
        $cfitness[$mem] = $cfitness[$mem-1] + $rfitness[$mem];
    }

    // 
    //  Select survivors using cumulative fitness. 
    //

    for ( $i = 0; $i < $POPSIZE; $i++ ) { 

        $p = mt_rand() / mt_getrandmax(); // get random number between 0 and 1

        if ( $p < $cfitness[0] ) {
            $newpopulation[$i] = $population[0];      
        }
        else {
            for ( $j = 0; $j < $POPSIZE-1; $j++ ) { 
                
                // if p is between cfitness of successive timetables
                if ( $cfitness[$j] <= $p && $p < $cfitness[$j+1] ) {
                    $newpopulation[$i] = $population[$j+1];
                }
            }

            if(empty($newpopulation[$i])) {  // if above for loop does not fill the position
                $newpopulation[$i] = $population[$POPSIZE-1];
            }
        }
    }

    // 
    //  Overwrite the old population with the new one.
    //
    for ( $i = 0; $i < $POPSIZE; $i++ ) {
        $population[$i] = $newpopulation[$i]; 
    }

    echo "done";

}


// driver function for crossover operation, which makes pairs of timetables 
// and calls Xover for each pair

function crossover() {

    global $population;
    global $POPSIZE;
    global $PXOVER;
    global $entries;
    global $config_nSlots;
    global $ndays;

    echo "<br/>Crossover...";

    /*
        You can adopt any other strategy you want for making pairs, 
        and then call Xover for each pair
        My strategy to make pairs for crossover: make random pairs traversing sequentially 
        in population irrespective of ascending or descending order of fitness values.
        Start traversing linearly, make pairs depending on comparison of random value and PXOVER
    */

    $first = 0;

    for ( $i = 0; $i < $POPSIZE; $i++ ) {

        $x = mt_rand() / mt_getrandmax(); // get random number between 0 and 1

        if ( $x < $PXOVER ) {
        
            $first++;

            if ( $first % 2 == 0 ) {

                $children = Xover( $population[$one], $population[$i] );
                
                $population[$one] = $children[0];
                $population[$i] = $children[1];
            
            }
            else {
                $one = $i;
            }

        }

    }

    echo "done";
}


// Xover function accepts two timetables whose crossover is to be done

function Xover ($parent1, $parent2) {

    global $entries;
    global $config_nSlots;
    global $ndays;

    // doing crossover of entries

    // select random k entries : generate random number k, 
    // create array having indices of entries array, select random k indices

    $rooms3d_1 = $parent1["rooms3d"];
    $teachers3d_1 = $parent1["teachers3d"];
    $classes3d_1 = $parent1["classes3d"];
    $batches3d_1 = $parent1["batches3d"];

    $rooms3d_2 = $parent2["rooms3d"];
    $teachers3d_2 = $parent2["teachers3d"];
    $classes3d_2 = $parent2["classes3d"];
    $batches3d_2 = $parent2["batches3d"];

    $k = mt_rand(1, count($entries));

    for ($i=0; $i < count($entries); $i++) { 
        $entries_index[$i] = $i;
    }

    $rand_keys = array_rand($entries_index, $k); // select random k values

    for ($i=0; $i < $k; $i++) { 

        /*
        strategy:

        get tId, cId, bId from entry

        find all room,day,slot occurences of this entry in rooms3d_1
        push r,d,s to array temp1 and make rooms3d_1[][][] = NULL and t3d_1[tId][][] = NULL 
        and c3d_1[cId][][] / b3d_1[bId][][] one by one as you find the entries 
        
        find all room,day,slot occurences of this entry in rooms3d_2
        push r,d,s to array temp2 and make rooms3d_2[][][] = NULL and t3d_2[tId][][] = NULL 
        and c3d_2[cId][][] / b3d_2[bId][][] one by one as you find the entries

        for each element(r,d,s) in temp1
            make rooms3d_2[r][d][s] = entry index
            make t3d_2[tId][d][s] = entry index
            if entry bid==-1
                make c3d_2[cId][d][s] = entry index
            else
                make b3d_2[bId][d][s] = entry index

        for each element(r,d,s) in temp2
            make rooms3d_1[r][d][s] = entry index
            make t3d_1[tId][d][s] = entry index
            if entry bid==-1
                make c3d_1[cId][d][s] = entry index
            else
                make b3d_1[bId][d][s] = entry index
        */

        $tId = $entries[$i]["tId"];
        $cId = $entries[$i]["cId"];
        $bId = $entries[$i]["bId"];

        $temp1 = array();
        $temp2 = array();      

        /*
        Not using for($room=0; $room < count($rooms3d_1); $room++)
        Not every rooms3d_1[room] may exist and there may exixt k greater than count(rooms3d_1)
        Happens when a roomId is missing, when a room is deleted. 
        Example roomIds: 1 2 3 4 6 8 9
        roomIds 5 and 7 are missing. rooms3d_1[9] will never be reached because count(rooms3d_1)
        will be 7
        Hence using foreach which gives all existing rooms
        But days and slot numbers are fixed, so can use normal for loop
        */

        foreach ($rooms3d_1 as $rId => $room) {
            for ($day=1; $day <= $ndays; $day++) { 
                for ($slot=1; $slot <= $config_nSlots; $slot++) { 

                    // ****** AND in_array($rand_keys[$i], $room[$day][$slot])
                    
                    if($room[$day][$slot] != NULL AND $room[$day][$slot] == $rand_keys[$i]) {
                        
                        array_push($temp1, array("rId" => $rId, "day" => $day, "slot" => $slot));
                        
                        $room[$day][$slot] = NULL;
                        $teachers3d_1[$tId][$day][$slot] = NULL;
                        if($bId == -1)
                            $classes3d_1[$cId][$day][$slot] = NULL;
                        else
                            $batches3d_1[$bId][$day][$slot] = NULL;
                    }
                }
            }
        }

        foreach ($rooms3d_2 as $rId => $room) {
            for ($day=1; $day <= $ndays; $day++) { 
                for ($slot=1; $slot <= $config_nSlots; $slot++) { 
                    
                    // ****** AND in_array($rand_keys[$i], $room[$day][$slot])

                    if($room[$day][$slot] != NULL AND $room[$day][$slot] == $rand_keys[$i]) {
                        
                        array_push($temp2, array("rId" => $rId, "day" => $day, "slot" => $slot));
                        
                        $room[$day][$slot] = NULL;
                        $teachers3d_2[$tId][$day][$slot] = NULL;
                        if($bId == -1)
                            $classes3d_2[$cId][$day][$slot] = NULL;
                        else
                            $batches3d_2[$bId][$day][$slot] = NULL;
                    }
                }
            }
        }

        for ($j=0; $j < count($temp1); $j++) { 

            $rId = $temp1[$j]["rId"];
            $day = $temp1[$j]["day"];
            $slot = $temp1[$j]["slot"];

            $rooms3d_2[$rId][$day][$slot] = $rand_keys[$i];
            $teachers3d_2[$tId][$day][$slot] = $rand_keys[$i];
            if($bId == -1)
                $classes3d_2[$cId][$day][$slot] = $rand_keys[$i];
            else
                $batches3d_2[$bId][$day][$slot] = $rand_keys[$i];
        }

        for ($j=0; $j < count($temp2); $j++) { 

            $rId = $temp2[$j]["rId"];
            $day = $temp2[$j]["day"];
            $slot = $temp2[$j]["slot"];

            $rooms3d_1[$rId][$day][$slot] = $rand_keys[$i];
            $teachers3d_1[$tId][$day][$slot] = $rand_keys[$i];
            if($bId == -1)
                $classes3d_1[$cId][$day][$slot] = $rand_keys[$i];
            else
                $batches3d_1[$bId][$day][$slot] = $rand_keys[$i];
        }
        
    }

    $child1 = array("rooms3d" => $rooms3d_1, "teachers3d" => $teachers3d_1, 
                    "classes3d" => $classes3d_1, "batches3d" => $batches3d_1);

    $child2 = array("rooms3d" => $rooms3d_2, "teachers3d" => $teachers3d_2, 
                    "classes3d" => $classes3d_2, "batches3d" => $batches3d_2);

    return array($child1, $child2);
    
}

function repair() {

    global $population;
    global $entries;
    global $config_nSlots;
    global $ndays;
    global $POPSIZE;

    /*
    
    *** when repairing, in new day slot, if cid exists, when checking whether class free in that
    day slot,
    also check whether no batch of that class has entry in that day slot
    if bid exists, when checking whether batch free in that day slot, also check whether class of
    that batch does not have entry in that day slot
    for both cases, traverse linearly in batchclass array

    *** entries in overlappingsbt always have to be together

    // repair room overlaps

    */

    echo "<br/>Repairing...";

    /*
    for ($mem=0; $mem < $POPSIZE; $mem++) { 

        $rooms3d = $population[$mem]["rooms3d"];
        $teachers3d = $population[$mem]["teachers3d"];
        $classes3d = $population[$mem]["classes3d"];
        $batches3d = $population[$mem]["batches3d"];

        foreach ($rooms3d as $rId => $room) {
            for ($day=1; $day <= $ndays; $day++) { 
                for ($slot=1; $slot <= $config_nSlots; $slot++) { 
                    // repair room overlaps
                }
            }
        }

        // at this point $room[$day][$slot] will have only 1 entry, since multiple entries in same
        day slot have been repaired above    
        
        foreach ($rooms3d as $rId => $room) {
            for ($day=1; $day <= $ndays; $day++) { 
                for ($slot=1; $slot <= $config_nSlots; $slot++) {                     

                    $x = $room[$day][$slot];

                    if( teacherOverlapSingleSlot($x, $day, $slot) OR 
                        classOverlapSingleSlot($x, $day, $slot) OR 
                        batchOverlapSingleSlot($x, $day, $slot) ) {

                        $emptyRoomDaySlot = findEmptyRoomDaySlot($rooms3d, $teachers3d, 
                        $classes3d, $batches3d);

                        if($emptyRoomDaySlot != -1) {

                            $tId = $entries[$x]["tId"];
                            $cId = $entries[$x]["cId"];
                            $bId = $entries[$x]["bId"];

                            $newRoom = $emptyRoomDaySlot["newRoom"];
                            $newDay = $emptyRoomDaySlot["newDay"];
                            $newSlot = $emptyRoomDaySlot["newSlot"];

                            for($i = 0; $i < $entries[$x]["eachSlot"]; $i++) {
                                
                                // make earlier slots NULL

                                $room[$day][$slot + $i] = NULL;
                                $teachers3d[$tId][$day][$slot + $i] = NULL;
                                if($bId == -1)
                                    $classes3d[$cId][$day][$slot + $i] = NULL;
                                else
                                    $batches3d[$bId][$day][$slot + $i] = NULL;


                                // allocate in new slots

                                $rooms3d[$newRoom][$newDay][$newSlot + $i] = $x;
                                $teachers3d[$tId][$newDay][$newSlot + $i] = $x;
                                if($bId == -1)
                                    $classes3d[$cId][$newDay][$newSlot + $i] = $x;
                                else
                                    $batches3d[$bId][$newDay][$newSlot + $i] = $x;


                            }
                        }
                        else {
                            echo "<br/>Could not find empty slot for $x<br/>";
                            // keep timetable as it is, its fitness cost will
                            // be too high, will be discarded by selector
                        }

                    }

                }
            }
        }

        $population[$mem] = array("rooms3d" => $rooms3d, "teachers3d" => $teachers3d, 
                                "classes3d" => $classes3d, "batches3d" => $batches3d);
    }

    */

    echo "done";

}

function teacherOverlapSingleSlot($entry_index, $day, $slot) {    

    global $entries;

    $tId = $entries[$entry_index]["tId"]; 

    if( $teachers3d[$tId][$day][$slot] != NULL AND count($teachers3d[$tId][$day][$slot]) > 1 )
        return 1;

    return 0;

}

function classOverlapSingleSlot($entry_index, $day, $slot) {
    
    global $entries;

    $cId = $entries[$entry_index]["cId"];

    if( $cId != -1 AND $classes3d[$cId][$day][$slot] != NULL 
        AND count($classes3d[$cId][$day][$slot]) > 1 )
        return 1;

    return 0;
}

function batchOverlapSingleSlot($entry_index, $day, $slot) {
    
    global $entries;

    $bId = $entries[$entry_index]["bId"];

    if( $bId != -1 AND $batches3d[$bId][$day][$slot] != NULL 
        AND count($batches3d[$bId][$day][$slot]) > 1 ) {
        
        // get batchset of $bId

        // $array = $batches3d[$bId][$day][$slot];

        /*
        for ($i=0; $i < count($array); $i++) { 

            if( !in_array($array[$i], $batchset) AND !in_array($array[$i], $overlappingsbt) ) {
                return 1;
            }
        }
        */
    }

    return 0;
}

function findEmptyRoomDaySlot($rooms3d, $entry_index, $teachers3d, $classes3d, $batches3d) {

    global $entries;
    global $config_nSlots;
    global $ndays;

    $slotLength = $entries[$entry_index]["eachSlot"];

    foreach ($rooms3d as $rId => $room) {
        for ($day=1; $day <= $ndays; $day++) { 
            for ($slot=1; $slot <= $config_nSlots; $slot++) { 

                if( roomEmptyMultipleSlots($rooms3d, $rId, $x, $day, $slot, $slotLength) == 1 AND
                    teacherOverlapMultipleSlots($teachers3d, $x, $day, $slot, $slotLength) == -1 AND
                    classOverlapMultipleSlots($classes3d, $x, $day, $slot, $slotLength) == -1 AND
                    batchOverlapMultipleSlots($batches3d, $x, $day, $slot, $slotLength) == -1 ) {

                    return array("newRoom" => $rId , "newDay" => $day , "newSlot" => $slot);
                }
            }
        }
    }

    return -1;

}

function roomEmptyMultipleSlots($rooms3d, $rId, $entry_index, $day, $slot, $slotLength) {

    global $rooms;
    global $entries;
    global $classes;
    global $batches;

    for ($i=0; $i < $slotLength; $i++) { 
        
        if($rooms3d[$rId][$day][$slot + $i] != NULL)
            return -1;
    }    

    // get whether class or batch

    $bId = $entries[$entry_index]["bId"];

    if($bId == -1) {
        for ($t=0; $t < count($classes); $t++) { 
            if($classes[$t]["classId"] == $cId)
                $min_capacity = $classes[$t]["classCount"];
        }
    }
    else {
        for ($t=0; $t < count($batches); $t++) { 
            if($batches[$t]["batchId"] == $bId)
                $min_capacity = $batches[$t]["batchCount"];
        }
    }

    // check whether room has min_capacity

    foreach ($rooms as $room) {
        if($room["roomId"] == $rId AND $room["roomCount"] < $min_capacity)
            return -1;
    }

    return 1;

}

function teacherOverlapMultipleSlots($teachers3d, $entry_index, $day, $slot, $slotLength) {

    global $entries;

    $tId = $entries[$entry_index]["tId"]; 

    for ($i=0; $i < $slotLength; $i++) { 
        
        if($teachers3d[$tId][$day][$slot + $i] != NULL)
            return 1;
    }    

    return -1;
}

function classOverlapMultipleSlots($classes3d, $entry_index, $day, $slot, $slotLength) {

    global $entries;

    $cId = $entries[$entry_index]["cId"];

    for ($i=0; $i < $slotLength; $i++) { 
        
        if($classes3d[$cId][$day][$slot + $i] != NULL)
            return 1;
    }    

    return -1;
}

function batchOverlapMultipleSlots($batches3d, $entry_index, $day, $slot, $slotLength) {

    global $entries;

    $bId = $entries[$entry_index]["bId"];

    for ($i=0; $i < $slotLength; $i++) { 
        
        if($batches3d[$bId][$day][$slot + $i] != NULL)
            return 1;
    }    

    return -1;
}

// finds fitness value of all timetables in the population

function evaluate() {

    global $population;
    global $fitness;
    global $POPSIZE;
    global $weight;
    global $entries;
    global $config_nSlots;
    global $ndays;

    echo "<br/>Evaluating...";

    for ( $i = 0; $i < $POPSIZE; $i++ ) {

        $tt = $population[$i];

        $fitness[$i] = $weight["Overlaps"] * get_overlaps_viol($tt) + 
                            $weight["Lunch"] * get_lunch_viol($tt) +
                            $weight["Multiple_Lectures"] * get_multiple_lectures_viol($tt) + 
                            $weight["Class_Room"] * get_class_room_viol($tt) + 
                            $weight["Teacher_Workload"] * get_teacher_workload_viol($tt) + 
                            $weight["Compact"] * get_compactness_viol($tt);

    }

    echo json_encode($fitness);

    //echo "done";

}

function get_overlaps_viol( $tt ) {

    global $entries;
    global $config_nSlots;
    global $ndays;

    $count = 0;

    $rooms3d = $tt["rooms3d"];
        
    foreach ($rooms3d as $rId => $room) {
        for ($day=1; $day <= $ndays; $day++) { 
            for ($slot=1; $slot <= $config_nSlots; $slot++) { 

                // *** need to check room overlap

                /*if($room[$day][$slot] != NULL AND count($room[$day][$slot]) > 1) {}
                    $count++;
                    continue;
                }
                */

                // at this point $room[$day][$slot] will have only 1 entry, 
                // since multiple entries have been checked above

                /*
                if( teacherOverlapSingleSlot($entries, $room[$day][$slot], $day, $slot) OR 
                    classOverlapSingleSlot($entries, $room[$day][$slot], $day, $slot) OR 
                    batchOverlapSingleSlot($entries, $room[$day][$slot], $day, $slot) )

                    $count++;
                */
            }
        }
    }

    return $count;
}

function get_lunch_viol($tt) {
}

function get_multiple_lectures_viol($tt) {
}

function get_class_room_viol($tt) {
}

function get_teacher_workload_viol($tt) {
}

function get_compactness_viol($tt) {
}


/*

These comments are for my reference

TODO: waiting to check whether rooms3d[][][] can have multiple entries in same field, this will 
change code in init, xover, repair, evaluate fitness overlap fns

can replace foreach with for, if rooms/teachers/classes/batches are not going to be deleted after
inserting

dept -> config -> snapshot -> timetable

*/

?>