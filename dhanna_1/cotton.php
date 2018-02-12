<html>
<body>
<u><h1>COTTON SAREES</h1></u>
<?php
   $con=mysql_connect("localhost","root","") or die(mysql_error());
    mysql_select_db('ready2',$con) or die("Connection Error");
   $n="cotton";
$res= mysql_query("SELECT * FROM stock WHERE cate='".$n."'");
     echo "<table><tr width=123>"; $li=0?>
<?php
             while($row = mysql_fetch_array($res)) 
	{
?>   
 <?php echo "<td>"; ?>
<form action="addcart.php" method=post><table><tr><td width=145><img src=" <?php echo $row["img"] ?>" height=150 width=150>
     </tr>
      <tr> <td width=145><font size=7 color="blue"><input name=add type=label value=<?php  echo $row["name"] ?> readonly="true">
             </tr></font>
    <tr><td width=145><font size=5 color="black">Price :<?php echo $p=$row["price"]?></tr>
<tr><td><center><input type=submit value=AddCart></center></form></tr>
</table>
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