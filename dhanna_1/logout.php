<html>
<body>
<?php
 $con=mysql_connect("localhost","root","") or die(mysql_error());
 mysql_select_db('ready2',$con) or die("Connection Error");
$sql="DELETE FROM res";
$res=mysql_query($sql);
if($res=true)
{
header("main.php");
session_start();
session_destroy();
echo "<br><br><center>You are successfully logged out"; 
?>
<a href="main.php" target=s3>Start_Again</a>	
<?php
}
else
{
echo "Try Again";
}?>
</body>
</html>