<?php 
	$con=mysql_connect("localhost","root","") or die(mysql_error());
     mysql_select_db('ready2',$con) or die("Connection Error");
	    $result = mysql_query("SELECT * FROM sign");
               echo "<table border=3>";
                 echo "<th>Name<td>CityName<td>MobileNumber</tr>";
               while($row = mysql_fetch_array($result)) 
	{
                 echo  "<tr><td>". $row["name"] . " <td>" . $row["city"]."<td> ".$row["no"]."</tr>";
                 echo "<br />"; 
                     } 
echo "</table>";
	mysql_close($con); 
	?> 