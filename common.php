<?php	

	class renderer {
		function default_style() {
			return "<style>
			.subjectentry {color:red}
			.teacherentry {color:blue}
			.batchentry {color:green}
			.roomentry {color:cyan}
			.classentry {color:magenta}
			.slottable {border:1}
			.menutable {border:1}
			</style>";

		}

		function default_header() {
			$j = $this->default_style();
			return "<html> 
			<head>
			<title> Test PHP Page </title>
			<meta charset=\"utf-8\" /> 
			<script type=\"text/javascript\" src=\"./jquery.js\">
			</script>
			</head>".$j; 
		}
		function default_scripts() {
			return "<script>
			function see_timetable(type, id) {
				window.location.replace(\"http://127.0.0.1/php/showtable.php?type=\"type\"&id=\"id);
			}
			</script>";

		}
		function default_footer() {
			return " </body> </html>";
		}
	}

	$OUTPUT = new renderer();
	global $OUTPUT;
?>
