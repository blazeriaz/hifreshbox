<html>
<head>
<style>
#frm
{
border:solid gray 1px;
width:65%;
border-radius:5px;
margin:100px auto;
background:white; 
padding:45px;
}
</style>
</head>
<body background="com.jpg">
<div id="frm">
<form>
<center>
<h1><u>The User Details In this page</u></h1>
<?php 
	$con=mysql_connect("localhost","root","") or die(mysql_error());
     mysql_select_db('ready2',$con) or die("Connection Error");
	    $result = mysql_query("SELECT * FROM sign");
               echo "<table border=3>";
                 echo "<th>Name<td>CityName<td>MobileNumber</tr>";
               while($row = mysql_fetch_array($result)) 
	{
                 echo  "<tr><td>". $row['name'] . " <td>" . $row['city']."<td> ".$row['no']."</tr>";
                 echo "<br />"; 
                     } 
echo "</table>";
	mysql_close($con); 
	?>
</form>
</div>
</body>
</html>