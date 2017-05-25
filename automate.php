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
 *	Description: Prepares an automated timetable using a genetic-like algoritm
*/

require_once('db.php');

$conn = dbConnect();

/*

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

*/

function fetch($conn, $query) {     
    //echo $query . "<br/>";
    $results = $conn->query($query);
    if($conn->error or $results === FALSE)
        die("Could not execute $query " . $conn->error. $results);
    while($rows[] = mysqli_fetch_assoc($results));
    array_pop($rows); // remove last empty entry
    return $rows;
}

//
//  Execution starts here
//

// 
//  Change these parameters to match your needs 
//

$POPSIZE = 50;
$MAXGENS = 20; // should be 1000, reduced to 100 for testing purposes
$PXOVER = 0.8;  // max probability value for a crossover to occur

$weight = array(); // weights for constraints' violations
$weight["Overlaps"] = 500;
$weight["Lunch"] = 15;  // no lunch in a day
$weight["Multiple_Lectures"] = 300; // multiple lectures of same subject in a day
$weight["Class_Room"] = 20; // class not having same room in a day
$weight["Teacher_Workload"] = 10; // teacher not having minimum workload
$weight["Compact"] = 12; // 40 timetable not being compact
    
$population = array();
$fitness = array();


$snapshotId = 1; // TODO: have a dropdown for this

// fetch configId
$temp = fetch($conn, "SELECT * FROM snapshot WHERE snapshotId = $snapshotId");
$configId = $temp[0]["configId"];

// fetch nSlots from config
$temp = fetch($conn, "SELECT * FROM config WHERE configId = $configId");
$nSlots = $temp[0]["nSlots"];

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

echo "<br/>To Schedule:<br/>";
for ($i=0; $i < count($entries); $i++) { 
    print_r($entries[$i]);
    echo "<br/>";
}


//
//  Algorithm starts here
//

initialize($population, $POPSIZE, $fitness, $entries, $nSlots, $rooms, $snapshotId, $conn);

repair();

evaluate( $population, $POPSIZE, $fitness, $weight, $teachers ); // finds fitness value of all timetables in the population

for ( $generation = 0; $generation < $MAXGENS; $generation++ )  { // MAXGENS is max iterations

    echo "<br/><br/>Generation " . ($generation+1);

    selector ( $population, $POPSIZE, $fitness ); 
    
    crossover ( $population, $POPSIZE, $subjects ); 

    repair();

    evaluate( $population, $POPSIZE, $fitness, $weight, $teachers );
}


//
//  Function definitions used in the algorithm starts here
//

function initialize(&$population, $POPSIZE, &$fitness, $entries, $nSlots, $rooms, $snapshotId, $conn) {

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
                $slot = mt_rand(1, $nSlots - $eachSlot + 1);

                if($entries[$j]["bId"] == -1) { // not batch, so a class

                    $cId = $entries[$j]["cId"];

                    if($rId == -1)
                        $rId = searchRoom($classroom, "classId", $entries[$j]["cId"]);

                    if($rId == -1)
                        $rId = mt_rand(1, count($rooms)); // find random room 
                    // TODO: while assigning random room check whether capacity of room is enough to fill in class/batch

                    for ( $k = 0; $k < count($eachSlot); $k++) { 
                        // make entries in room, teacher and class table at slots $slot + $k
                        // entry will have just index $j
                        $rooms3d[$rId][$day][$slot + $k] = $j;
                        $teachers3d[$tId][$day][$slot + $k] = $j;
                        $classes3d[$cId][$day][$slot + $k] = $j;
                    }
                }
                else { // batch

                    $bId = $entries[$j]["bId"];

                    if($rId == -1)
                        $rId = searchRoom($batchroom, "batchId", $entries[$j]["bId"]);

                    if($rId == -1)
                        $rId = mt_rand(1, count($rooms)); // find random room
                    // TODO: while assigning random room check whether capacity of room is enough to fill in class/batch

                    for ( $k = 0; $k < count($eachSlot); $k++) { 
                        // make entries in room, teacher and batch table at slots $slot + $k
                        // entry will have just index $j
                        $rooms3d[$rId][$day][$slot + $k] = $j;
                        $teachers3d[$tId][$day][$slot + $k] = $j;
                        $batches3d[$bId][$day][$slot + $k] = $j;
                    }
                }

            }

        }

        $population[$i] = array("rooms" => $rooms3d, "teachers" => $teachers3d, "class" => $classes3d, "batches" => $batches3d);

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


        // intialize the 3d arrays to null, in first loop of initialize
        //init3d($rooms, $teachers, $classes, $batches, $rooms3d, $teachers3d, $classes3d, $batches3d);
        // not needed, just use if(empty($rooms3d[][][]))
/*
function init3d($rooms, $teachers, $classes, $batches, &$rooms3d, &$teachers3d, &$classes3d, &$batches3d) {

    for ($t1=0; $t1 < count($rooms); $t1++) { 
        for ($t2=0; $t2 < 5; $t2++) { 
            for ($t3=0; $t3 < $nSlots; $t3++) { 
                $rooms3d[$t1][$t2][$t3] = NULL;
            }
        }
    }

    for ($t1=0; $t1 < count($teachers); $t1++) { 
        for ($t2=0; $t2 < 5; $t2++) { 
            for ($t3=0; $t3 < $nSlots; $t3++) { 
                $teachers3d[$t1][$t2][$t3] = NULL;
            }
        }
    }

    for ($t1=0; $t1 < count($classes); $t1++) { 
        for ($t2=0; $t2 < 5; $t2++) { 
            for ($t3=0; $t3 < $nSlots; $t3++) { 
                $classes3d[$t1][$t2][$t3] = NULL;
            }
        }
    }

    for ($t1=0; $t1 < count($batches); $t1++) { 
        for ($t2=0; $t2 < 5; $t2++) { 
            for ($t3=0; $t3 < $nSlots; $t3++) { 
                $batches3d[$t1][$t2][$t3] = NULL;
            }
        }
    }
}
*/

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

function crossover(&$population, $POPSIZE, $subjects) {

    echo "<br/>Crossover...";

    // $k = mt_rand(1, count($subjects));
    // then select random k subjects
/*

use subjects3d as primary array for crossover. take all not null day,slot in selected subject and swap with all not null day,slot of other tt.
change day,slot of the room in rooms3d. room remains the same. rooms3d[rid][newday][newslot] = $j. rooms3d[rid][oldday][oldslot]=NULL
same for classes3d, batches3d

replace 2 worst tts with children of 2 best tts

select random k subjects. 

tmp = tt1

Replace day,slot of these subjects in tt1 with day,slot of the respective subject in tt2. This is child 1.

Replace day,slot of these subjects in tt2 with day,slot of the respective subject in tmp. This is child 2. 
*/

    /*for ( $i = 0; $i < $POPSIZE; $i++ ) {

    }*/

    echo "done";
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

?>