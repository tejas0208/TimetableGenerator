<?php
// This file is part of Samay - a timetabling software for 
// schools, colleges/universities.
//
// Samay is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Samay is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Samay.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * Copyright 2007 Abhijit A. M.(abhijit13@gmail.com)
 */
		unset($CFG);
		global $CFG;

		$CFG = new stdClass();

		$CFG->db_type = "mysqli";
		$CFG->db_user = "root";
		$CFG->db_pass = "root";
		$CFG->db_database = "timeTable";
		$CFG->server = "localhost";
		$CFG->port = "3306";
		$CFG->conn = false;
	?>
