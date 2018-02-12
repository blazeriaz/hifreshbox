<html>
<body>
<?php
 $con=mysql_connect("localhost","root","") or die(mysql_error());
 mysql_select_db('ready2',$con) or die("Connection Error");
 $n=$_POST['t1'];
 $n1=$_POST['ufile'];
  $n2=$_POST['t2'];
$n3=$_POST['price'];
$sql="INSERT INTO stock(img,name,cate,price) VALUES('$n1','$n','$n2','$n3')";
$result=mysql_query($sql);
if (!$result)
{
echo "<center><br><br><br>Product is not SuccessFully Added</center>";
}
else
{
echo "<center><br><br><br>Product Is SuccessFully Added</center>";
}
?>
</body>
</html>