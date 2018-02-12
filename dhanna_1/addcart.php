<html>
<?php
 $con=mysql_connect("localhost","root","") or die(mysql_error());
 mysql_select_db('ready2',$con) or die("Connection Error");
// $res= mysql_query("SELECT * FROM stock WHERE name='".$_POST['add']."'");
$s=$_POST['add'];
   $sell=mysql_query("INSERT INTO res(name,price)SELECT name,price FROM stock WHERE name='$s'") ;
   if($sell=true)
   {
     echo "<Font size=24 color=blue><br><br><br><center>Success Fuly Added The Shopping Cart!</font></h1> ";?>
   <center> <br><br><br> <a href="home.php">GO TO Shopping Page</a></center>
     <?php
   }
   else{
     echo "Not success";
   }
?>
</html>