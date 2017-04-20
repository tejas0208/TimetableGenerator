<?php 
// Credit: Code borrowed from http://stackoverflow.com/questions/22195493/export-mysql-database-using-php-only
// Copyright Author, as per stackoverflow http://stackoverflow.com/users/1518921/guilherme-nascimento
// License, terms and conditions of stackoverflow.com apply. 
require_once('./db.php');

    function exportDatabase($tables=false, $backup_name=false )
    {
		$mysqli = dbConnect();
        $mysqli->query("SET NAMES 'utf8'");

		$target_tables = array("dept", "user", "config", "snapshot", 
							"teacher", "class", "batch", "subject", 
							"batchCanOverlap", "batchClass", "room", 
							"classRoom", "batchRoom", "subjectRoom", 
							"subjectBatchTeacher", "subjectClassTeacher", 
							"overlappingSBT", "timeTable", "fixedEntry",
						);
		$target_views = array("teacherReadable", "batchCanOverlapReadable",
							"subjectClassTeacherReadable", "subjectBatchTeacherReadable",
							"batchClassReadable","overlappingSBTReadable",
							"timeTableReadable", "classRoomReadable",
							"batchRoomReadable", "subjectRoomReadable");

		$content = "drop database timeTable; create database timeTable; use timeTable;";

        foreach($target_tables as $table)
        {
            $result         =   $mysqli->query('SELECT * FROM '.$table);  
            $fields_amount  =   $result->field_count;  
            $rows_num		=	$mysqli->affected_rows;     
            $res            =   $mysqli->query('SHOW CREATE TABLE '.$table); 
            $TableMLine     =   $res->fetch_row();
            $content        = (!isset($content) ?  '' : $content) . "\n\n".$TableMLine[1].";\n\n";

			$query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS ". 
				" WHERE TABLE_SCHEMA='timeTable' AND TABLE_NAME='".$table."';";
			$colNames = sqlGetAllRows($query);

            for ($i = 0, $st_counter = 0; $i < $fields_amount;   $i++, $st_counter=0) 
            {
                while($row = $result->fetch_row())  
                { //when started (and every after 100 command cycle):
                    if ($st_counter%100 == 0 || $st_counter == 0 )  
                    {
                            $content .= "\nINSERT INTO ".$table;
							$content .= "(";
							for($k = 0; $k < count($colNames) - 1; $k++) {
								$content .= $colNames[$k]["COLUMN_NAME"].", ";
							}
							$content .= $colNames[$k]["COLUMN_NAME"].") VALUES ";
					}
					$content .= "\n(";
                    for($j=0; $j<$fields_amount; $j++)  
                    { 
                        $row[$j] = str_replace("\n","\\n", addslashes($row[$j]) ); 
                        if (isset($row[$j]) && $row[$j] != "")
                        {
                            $content .= '"'.$row[$j].'"' ; 
                        }
                        else {
                            $content .= 'NULL';
                        }     
                        if ($j<($fields_amount-1))
                        {
                                $content.= ',';
                        }      
                    }
                    $content .=")";
                    //every after 100 command cycle [or at last line] ....p.s. but should be inserted 1 cycle eariler
                    if ( (($st_counter+1)%100==0 && $st_counter!=0) || $st_counter+1==$rows_num) 
                    {   
                        $content .= ";";
                    } 
                    else 
                    {
                        $content .= ",";
                    } 
                    $st_counter=$st_counter+1;
                }
            } $content .="\n\n\n";
        }
	
        foreach($target_views as $view)
        {
            $res            =   $mysqli->query('SHOW CREATE TABLE '.$view); 
            $TableMLine     =   $res->fetch_row();
            $content        .=  "\n\n".$TableMLine[1].";\n\n";
		}
        //$backup_name = $backup_name ? $backup_name : $name."___(".date('H-i-s')."_".date('d-m-Y').")__rand".rand(1,11111111).".sql";
        $backup_name = $backup_name ? $backup_name : "backup".".sql";
        header('Content-Type: application/octet-stream');   
        header("Content-Transfer-Encoding: Binary"); 
        header("Content-disposition: attachment;");
		header("filename: ".$backup_name);  
        echo $content; exit;
    }
?>
