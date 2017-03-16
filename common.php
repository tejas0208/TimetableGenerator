<?php	

	class renderer {
		function defaultStyle() {
			return "<style>
			.subjectentry {color:red}
			.teacherentry {color:blue}
			.batchentry {color:green}
			.roomentry {color:cyan}
			.classentry {color:magenta}
			.slottable {border:1}
			.menutable {border:1}
			.cell {width:200px; height:100px;}
			.cell:hover {background-color: #f5f5f5}
			.dayname {width:100px; height:100px;}
			</style>";

		}

		function defaultHeader() {
			$j = $this->defaultStyle();
			return "<html> 
			<head>
			<title> Test PHP Page </title>
			<meta charset=\"utf-8\" /> 
			<script type=\"text/javascript\" src=\"./jquery.js\">
			</script>
			</head>".$j; 
		}
		function defaultScripts() {
			return "<script>
			function see_timetable(type, id) {
				window.location.replace(\"http://127.0.0.1/php/showtable.php?type=\"type\"&id=\"id);
			}
			</script>";

		}
		function defaultFooter() {
			return " </body> </html>";
		}
	}
	function getArgument($arg) {
		if(isset($_POST[$arg]))
				return $_POST[$arg];
		else if(isset($_GET[$arg]))
				return $_GET[$arg];
		else
			return ""; 
	}
	$OUTPUT = new renderer();
	global $OUTPUT;
?>
