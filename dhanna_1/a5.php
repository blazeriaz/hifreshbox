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
<h1><u>The Order Details In this page</u></h1>
<?php 
	$con=mysql_connect("localhost","root","") or die(mysql_error());
     mysql_select_db('ready2',$con) or die("Connection Error");
	    $x="SELECT * FROM orders";
      $result = mysql_query($x);
               echo "<table border=3>";
                 echo "<th>Name<td>HouseName<td>Address<td>LandMark<td>Contact No</tr>";
               while($row = mysql_fetch_array($result)) 
	{
                 echo  "<tr><td>".$row['name'] . " <td>" .$row['hname']."<td> ".$row['address']."<td>".$row['lanmark']."<td>".$row['num']."</tr>";
                 echo "<br />"; 
                     } 
echo "</table>";
	mysql_close($con); 
	?>
</div>
</form>
</body>
</html>