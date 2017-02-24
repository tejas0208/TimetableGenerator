#!/bin/bash
cat $1 | while read -e line;
do
	count=`echo "$line" | wc -w`
	#echo $count
	i=1;
	while [ $i -le $count ]
	do
		ith=`echo "$line" | cut -d ' ' -f $i`	
		j=1
		while [ $j -le $count ]
		do
			jth=`echo "$line" | cut -d ' ' -f $j`	
			if [ $j -ne $i ]
			then
				echo "$ith,$jth"	
			fi
			j=`expr $j + 1`
		done
		i=`expr $i + 1`
	done
done
