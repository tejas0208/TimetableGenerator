<?php

unset($CFG);
global $CFG;

$CFG = new stdClass();

$CFG->db_type = "mysqli";
$CFG->db_user = "root";
$CFG->db_pass = "root";
$CFG->db_database = "timeTable";
$CFG->server = "localhost";

?>
