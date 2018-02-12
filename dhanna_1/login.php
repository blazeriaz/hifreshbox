<html>
<?php
session_start();
 $con=mysql_connect("localhost","root","") or die(mysql_error());
 mysql_select_db('ready2',$con) or die("Connection Error");
 $name=$_POST['name'];
 $pwd=$_POST['pass'];
   $ad="admin";
   $pd="admin";
   $query=mysql_query("SELECT  * FROM sign WHERE user='".$name."' and pass='".$pwd."'") or die(mysql_error());
   
   $res=mysql_fetch_array($query);
if($res['user']==$ad && $res['pass']==$pd)
{
  include("admin.php");
}
   elseif($res['user']==$name && $res['pass']==$pwd)
   {
       include("samp.php");
   }
   else
   {
 echo "<center><h1><b>Log in is Not Success</b></h1></center>";
  }
 
?>
<body>
<a href="log.php">Back to Home</a>
</body>

</html>