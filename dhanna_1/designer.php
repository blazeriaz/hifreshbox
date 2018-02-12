<html>
<head>
</head>
<body>
<u><h1>DESIGER SAREES</h1></u>
<?php
   $con=mysql_connect("localhost","root","") or die(mysql_error());
    mysql_select_db('ready2',$con) or die("Connection Error");
   $sql="SELECT * FROM stock WHERE cate='designer' ";
    $res= mysql_query($sql);
?>
       <?php
     echo "<table><tr>"; $li=0?>
<?php
             while($row = mysql_fetch_array($res)) 
	{
        echo "<td>";
?>   
<form action="addcart.php" method=post>
 <table align=center><tr><td width=145>
  <img src="<?php   echo $row["img"] ?>" height=150 width=150>;
  <tr><td align=center width=145><font size=7 color="blue"> <input type=label name=add value=<?php  echo $row["name"] ?>>
             </font></tr>
  <tr><td width=145><font size=5 color="black">Price :<?php echo $p=$row["price"]?>
</tr>
<tr><td><center><input type=submit value=AddCart></form></center></tr></table>
   <?php 
$li=$li+1;
if($li==3)
{
$li=0;
echo "</tr>";
   }
                     } 
?>
</table>
</body>
</html>