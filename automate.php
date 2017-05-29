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
 *	Author: Aniket Bhadane (aniketbhadane93@gmail.com)
 *  
 *	Description: 
 *  Prepares an automated timetable using a genetic-like algoritm. 
 *  The program expects 'currentSnapshotId' to be received as POST/GET argument.
 *  If it does not receive 'currentSnapshotId', it assumes snapshotId to be 1 (which is default snapshot)
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

$POPSIZE = 50; // number of timetables (population size) in a generation
$MAXGENS = 20; // should be 1000, reduced to 100 for testing purposes
$PXOVER = 0.8; // maximum probability value for a crossover to occur

$weight = array();                      // weights for constraints' violations
$weight["Overlaps"] = 500;              // no overlaps
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
$temp = fetch($conn, "SELECT * FROM snapshot WHERE snapshotId = $snapshotId");
$configId = $temp[0]["configId"];

// fetch nSlots from config
$temp = fetch($conn, "SELECT * FROM config WHERE configId = $configId");
$config_nSlots = $temp[0]["nSlots"];

$rooms = fetch($conn, "SELECT * FROM room WHERE snapshotId = $snapshotId");

$teachers = fetch($conn, "SELECT * FROM teacher WHERE snapshotId = $snapshotId");

$classes = fetch($conn, "SELECT * FROM class WHERE snapshotId = $snapshotId");

$batches = fetch($conn, "SELECT * FROM batch WHERE snapshotId = $snapshotId");

$batchclass = fetch($conn, "SELECT * FROM batchclass WHERE snapshotId = $snapshotId");


//
// Fill the entries array
//

$entries = array();

$subjects = fetch($conn, "SELECT * FROM subject WHERE snapshotId = $snapshotId");

for ($i=0; $i < count($subjects); $i++) { 

    // entry: sid tid cid bid eachslot nslots  ( cid=-1 if subject scheduled in batch, bid=-1 if not a batch )

    $sId = $subjects[$i]["subjectId"];

    $eachSlot = $subjects[$i]["eachSlot"];

    $nSlots = $subjects[$i]["nSlots"];

    if($subjects[$i]["batches"] == 1) {

        $temp = fetch($conn, "SELECT * FROM subjectbatchteacher WHERE subjectId = $sId");

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
        
        $temp = fetch($conn, "SELECT * FROM subjectclassteacher WHERE subjectId = $sId");

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

echo "<br/>To Schedule " . count($entries) . " entries:<br/>";
for ($i=0; $i < count($entries); $i++) { 
    print_r($entries[$i]);
    echo "<br/>";
}


//
//  Algorithm starts here
//

initialize($population, $POPSIZE, $fitness, $entries, $config_nSlots, $rooms, $classes, $batches, $snapshotId, $conn);

repair();

evaluate( $population, $POPSIZE, $fitness, $weight, $teachers ); // finds fitness value of all timetables in the population

for ( $generation = 0; $generation < $MAXGENS; $generation++ )  { // MAXGENS is maximum number of iterations

    echo "<br/><br/>Generation " . ($generation+1);

    selector ( $population, $POPSIZE, $fitness ); 
    
    crossover ( $population, $POPSIZE, $entries, $PXOVER, $config_nSlots ); 

    repair();

    evaluate( $population, $POPSIZE, $fitness, $weight, $teachers );
}

/*
//
//  Create New Snapshot
//

while sending data to saveNewSNapshot, json_encode timetable data, 'ttData' => json_encode($timeTable)
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

function fetch($conn, $query) {     
    //echo $query . "<br/>";
    $results = $conn->query($query);
    if($conn->error or $results === FALSE)
        die("Could not execute $query " . $conn->error. $results);
    while($rows[] = mysqli_fetch_assoc($results));
    array_pop($rows); // remove last empty entry
    return $rows;
}

function initialize(&$population, $POPSIZE, &$fitness, $entries, $config_nSlots, $rooms, $classes, $batches, $snapshotId, $conn) {

    echo "<br/>Initializing...";

    $subjectroom = fetch($conn, "SELECT * FROM subjectroom WHERE snapshotId = $snapshotId");
    $classroom = fetch($conn, "SELECT * FROM classroom WHERE snapshotId = $snapshotId");
    $batchroom = fetch($conn, "SELECT * FROM batchroom WHERE snapshotId = $snapshotId");

    for ( $i = 0; $i < $POPSIZE; $i++ ) {

        $rooms3d = array(); $teachers3d = array(); $classes3d = array(); $batches3d = array();

        for ( $j = 0; $j < count($entries); $j++) { 

            for ( $m = 0 ; $m < $entries[$j]["nSlots"] ; $m++) {

                $rId = searchRoom($subjectroom, "subjectId", $entries[$j]["sId"]);

                $tId = $entries[$j]["tId"];

                $eachSlot = $entries[$j]["eachSlot"];

                $day = mt_rand(1,5);
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

                        $rId = getRandomRoom($rooms, $min_capacity); // find random room with enough capacity
                    }

                    for ( $k = 0; $k < count($eachSlot); $k++) { 

                        // storing index of entry

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

                        $rId = getRandomRoom($rooms, $min_capacity); // find random room with enough capacity
                    }

                    for ( $k = 0; $k < count($eachSlot); $k++) { 

                        // storing index of entry

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

function searchRoom($array, $field, $id) {

    for ($i=0; $i < count($array); $i++) { 
        
        if($array[$i][$field] == $id)
            return $array[$i]["roomId"];
    }

    return -1;
}

function getRandomRoom($rooms, $min_capacity) {

    $array = array();

    for ($i=0; $i < count($rooms); $i++) { 
            
        if($rooms[$i]["roomCount"] >= $min_capacity)
            array_push($array, $rooms[$i]["roomId"]);
    }

    //$k = array_rand($array);
    //return $array[$k];

    return $array[mt_rand(0, count($array) - 1)];

}


function selector( &$population, $POPSIZE, $fitness ) {

    /*
    Reproduction (or selection) is an operator that makes more copies of better timetables in a new population.
    Reproduction SELECTS good timetables in a population and forms a mating pool. This is one of the reason for the reproduction operation to be sometimes known as the selection operator.
    The above average timetables are picked from the current population and their multiple copies are inserted in the new population in a probabilistic manner.
    */

    // Standard proportional selection for maximization problems.
    // Also makes sure that the best member always survives, population[POPSIZE] is untouched

    echo "<br/>Selector...";

    $newpopulation = array();

    // required for maximization process
    $rfitness = array();
    $cfitness = array();

    // best tt has minimum fitness value, but for the maximization process best tt requires highest fitness value
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
    for ( $mem = 0; $mem < $POPSIZE; $mem++ )
    {
        $sum = $sum + $inv_fitness[$mem];
    }
    
    //
    //  Calculate the relative fitness of each member.
    //
    for ( $mem = 0; $mem < $POPSIZE; $mem++ )
    {
        $rfitness[$mem] = $inv_fitness[$mem] / $sum;
    }
    
    // 
    //  Calculate the cumulative fitness.
    //
    $cfitness[0] = $rfitness[0];
    for ( $mem = 1; $mem < $POPSIZE; $mem++ )
    {
        $cfitness[$mem] = $cfitness[$mem-1] + $rfitness[$mem];
    }

    // 
    //  Select survivors using cumulative fitness. 
    //

    for ( $i = 0; $i < $POPSIZE; $i++ )
    { 

        $p = mt_rand() / mt_getrandmax(); // get random number between 0 and 1

        if ( $p < $cfitness[0] )
        {
            $newpopulation[$i] = $population[0];      
        }
        else
        {
            for ( $j = 0; $j < $POPSIZE-1; $j++ )
            { 
                if ( $cfitness[$j] <= $p && $p < $cfitness[$j+1] ) // if p is between cfitness of successive timetables
                {
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
    for ( $i = 0; $i < $POPSIZE; $i++ )
    {
        $population[$i] = $newpopulation[$i]; 
    }

    echo "done";

}

function crossover(&$population, $POPSIZE, $entries, $PXOVER, $config_nSlots) {

    echo "<br/>Crossover...";

    /*
        You can adopt any other strategy you want for making pairs, and then call Xover for each pair
        My strategy to make pairs for crossover: make random pairs traversing sequentially in population irrespective of ascending or descending order of fitness values.
        Start traversing linearly, make pairs depending on comparison of random value and PXOVER        
    */

    $first = 0;

    for ( $i = 0; $i < $POPSIZE; $i++ ) {

        $x = mt_rand() / mt_getrandmax(); // get random number between 0 and 1

        if ( $x < $PXOVER ) {
        
            $first++;

            if ( $first % 2 == 0 ) {

                $children = Xover( $population[$one], $population[$i], $entries, $config_nSlots );
                
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

function Xover ($parent1, $parent2, $entries, $config_nSlots) {

    // doing crossover of entries

    // select random k entries : generate random number k, create array having indices of entries array, select random k indices

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
        push r,d,s to array temp1 and make rooms3d_1[][][] = NULL and t3d_1[tId][][] = NULL and c3d_1[cId][][] / b3d_1[bId][][] one by one as you find the entries 
        
        find all room,day,slot occurences of this entry in rooms3d_2
        push r,d,s to array temp2 and make rooms3d_2[][][] = NULL and t3d_2[tId][][] = NULL and c3d_2[cId][][] / b3d_2[bId][][] one by one as you find the entries

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
        Happens when a roomId is missing. Example roomIds: 1 2 3 4 6 8 9
        roomIds 5 and 7 are missing. rooms3d_1[9] will never be reached because count(rooms3d_1) will be 7
        Hence using foreach which gives all existing rooms
        But days and slot numbers are fixed, so can use normal for loop
        */

        foreach ($rooms3d_1 as $rId => $room) {
            for ($day=1; $day <= 5; $day++) { 
                for ($slot=1; $slot <= $config_nSlots; $slot++) { 
                    
                    if(!empty($room[$day][$slot]) AND $room[$day][$slot] == $rand_keys[$i]) {
                        
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
            for ($day=1; $day <= 5; $day++) { 
                for ($slot=1; $slot <= $config_nSlots; $slot++) { 
                    
                    if(!empty($room[$day][$slot]) AND $room[$day][$slot] == $rand_keys[$i]) {
                        
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

    echo "<br/>Repairing...";

    echo "done";

}

function evaluate( $population, $POPSIZE, &$fitness, $weight, $teachers ) {

    echo "<br/>Evaluating...";

    for ( $i = 0; $i < $POPSIZE; $i++ )
    {
        $tt = $population[$i];

        $fitness[$i] = $weight["Overlaps"] * get_overlaps_viol($tt) + 
                            $weight["Lunch"] * get_lunch_viol($tt) +
                            $weight["Multiple_Lectures"] * get_multiple_lectures_viol($tt) + 
                            $weight["Class_Room"] * get_class_room_viol($tt) + 
                            $weight["Teacher_Workload"] * get_teacher_workload_viol($tt, $teachers) + 
                            $weight["Compact"] * get_compactness_viol($tt);

    }

    echo json_encode($fitness);

    //echo "done";

}

function get_overlaps_viol($tt) {
}

function get_lunch_viol($tt) {
}

function get_multiple_lectures_viol($tt) {
}

function get_class_room_viol($tt) {
}

function get_teacher_workload_viol($tt, $dbhrs) {
}

function get_compactness_viol($tt) {
}


/*

These comments are for my reference

$entries

*** refer the ese exam genetic answer pics and quiz2 pdf

data structures to use for storing timetable?

clash types: room, teacher, class(theory subjects), batch. Each 3d array. ex. a particular rooms[roomId][dayId][slotId] field should have only one entry. more than one entry in a field means room clash

initialize
repair
evaluate
loop {
selector
crossover
repair
evaluate
}

To detect clashes, use room array (multiple entries in the same field of the 3d array) :
use rooms 3d array as the primary.
Teachers, theory, batches as secondary

linearly traverse rooms array. Start checking rooms array linearly, if a free room found, check whether teacher available at that day slot using teachers array, whether theory/batch not already scheduled at that day slot using theory/batches array.

when repairing, in new day slot, if cid exists, when checking whether class free in that day slot, also check whether no batch of that class has entry in that day slot
if bid exists, when checking whether batch free in that day slot, also check whether class of that batch does not have entry in that day slot
for both cases, traverse linearly in batchclass array

also check whether new room has capacity to fill all students in class/batch

*** entries in overlappingbt always have to be together, handle this in repair

what to do when no free slot available when repairing? keep tt as it is, its fitness cost will be too high

how to handle eachSlot!!!
subjects with eachslot more than 1: during initialization itself make them in consecutive slots

day = random between 1 and 5
slot = random between 0 and max_slots - eachSlot
room = random
fill respective fields, equal to number of eachSlot, in all arrays. 

how to handle batches? how to randomize them in intialization?
how to make batches together?
allocate batches like normal subjects. Not necessary all batches in a overlapping batch set always have to together. During checking overlaps, if a batch overlaps with a batch it can overlap as per database, its allowed and not considered as a clash.
Also its allowed if overlapping batches are present together in overlappingsbt table


rooms[rId][dId][sId] = array(classId, subjectId, teacherId, batchId, nSlots=1/2/3/...) - this is any entry in entries array

Maintain consecutive slots in other operations: crossover, mutate, repair

Dont do mutate. Omit mutate for the time being

Initial

crossover:

replace 2 worst tts with children of 2 best tts

select random k subjects. 

tmp = tt1

Replace day,slot of these subjects in tt1 with day,slot of the respective subject in tt2. This is child 1.

Replace day,slot of these subjects in tt2 with day,slot of the respective subject in tmp. This is child 2. 

Make entry in snapshot table with default config default (1). Display this on page.
Future work: accept config from user, as dropdown

dept -> config -> snapshot -> timetable

use if(!empty($rooms3d[][][])) to check if a field contains some data

*/

?>