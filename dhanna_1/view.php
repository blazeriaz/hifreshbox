<html>
<body>
<?php
  $con=mysql_connect("localhost","root","") or die(mysql_error());
    mysql_select_db('ready2',$con) or die("Connection Error");
     $sql1="SELECT * FROM res ";
     $res= mysql_query($sql1);
     $am=0;
     ?>
<table align=center border=2><th width=234>Product Name<th width=234>Price</table>
<?php
echo "<table border=2 align=center>";
             while($row = mysql_fetch_array($res)) 
	{
      echo "<tr><td width=234>";
      echo  $row["name"];
      echo "<td width=234>";
       echo $row["price"];
       $am=$am+$row["price"];
       echo "</tr>";
                       }
echo "</table>";
?>
</table>
<br><br>
<center><font size=24>Your are Purchased For    -     RS :<?php echo $am ?></font></center> 
<?php
$d=date("D");

if($d=="Mon")
				{
    echo" <h1><center>Offer in 12% of all product</h1></center>" ;
                   $a=$am * 12/100;
$am=$am-$a;
 echo "<center><h1>Payed Amount is :-   RS:".$am;

}
elseif($d=="Tue")
{
echo" <h1><center>Offer in 17% of all product</h1></center>";
$a=$am * 17/100;
$am=$am-$a;
 echo "<center><h1>Payed Amount is :-   RS:".$am;
}
elseif($d=="Wed")
{
echo" <h1><center>Offer in 13% of all product</h1></center>";
$a=$am * 13/100;
$am=$am-$a;
 echo "<center><h1>Payed Amount is :-   RS:".$am;
}
elseif($d=="Thu")
{
echo" <h1><center>Offer in 11% of all product</h1></center>";
$a=$am * 11/100;
$am=$am-$a;
 echo "<center><h1>Payed Amount is :-   RS:".$am;
}
elseif($d=="Fri")
{
echo"<h1><center>Offer in 22% of all product</h1></center>";
$a=$am * 22/100;
$am=$am-$a;
 echo "<center><h1>Payed Amount is :-   RS:".$am;
}
elseif($d=="Sat")
  {
echo"<h1><center>Holiday Offer in 35% of all product</h1></center>";
$a=$am * 35/100;
$am=$am-$a;
 echo "<center><h1>Payed Amount is :-   RS:".$am;
  }
  elseif($d=="Sun")
   {  
echo"Holiday Offer in 23% of all product</h1></center>";
$a=$am * 23/100;
$am=$am-$a;
 echo "<center><h1>Payed Amount is :-   RS:".$am;
   }
?>
<br><br>
<a href="order.php">Order_Now</a>
</body>
</html>