<!DOCTYPE html>
<!--
// This file is part of Taasika - a timetabling software for
// schools, colleges/universities.
//
// Taasika is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Taasika is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Taasika.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * Copyright 2017 Abhijit A. M.(abhijit13@gmail.com)
 */
--> 
<html lang="en">
	<head>
		<title>TimeTable Installation</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="../bootstrap/bootstrap.min.css">
		<script type="text/javascript" src="../bootstrap/jquery.min.js"></script>
		<script type="text/javascript" src="../bootstrap/bootstrap.min.js"></script>
		<script type="text/javascript" src="../bootstrap/bootstrap-show-password.min.js"></script>
		<script src="../bootstrap/validator.min.js"></script>
		<link rel="stylesheet" type="text/css" href="install.css">
		</link>
	</head>
	<body>
		<div class="container">
			<div class="row">
				<div class="column left">
					<h2 style="margin-bottom:20px">Taasika</h2>
					<div class="list-group list-group-flush">
						<button id="checkRequirements" type="button" style="border: none" class="list-group-item enabled">Verify Requirements</button>
						<button id="setDatabase" type="button" style="border: none" class="list-group-item disabled">Set Up Database</button>
						<button id="departmentConfig" type="button" style="border: none" class="list-group-item disabled">Department Configuration</button>
						<button id="userConfig" type="button" style="border: none" class="list-group-item disabled">User Configuration</button>
						<button id="defaultConfig" type="button" style="border: none" class="list-group-item disabled">Default Configuration</button>
					</div>
				</div>
				<div class="column right">
					<div id="check" style="padding-left:20px;padding-right:20px"></div>
					<div id="next"></div>
				</div>
			</div>
		</div>
		<script src="install.js"></script>
	</body>
</html>
