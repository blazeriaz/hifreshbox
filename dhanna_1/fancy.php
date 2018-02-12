<html>
<body>
<u><h1>FANCY SAREES</h1></u>
<?php
   $con=mysql_connect("localhost","root","") or die(mysql_error());
    mysql_select_db('ready2',$con) or die("Connection Error");
   $n="fancy";
$res= mysql_query("SELECT * FROM stock WHERE cate='".$n."'");
     echo "<table><tr>"; $li=0?>
<?php
             while($row = mysql_fetch_array($res)) 
	{
?>   
 <?php echo "<td>"; ?><table><tr><td><img src="<?php   echo $row["img"] ?>" height=150 width=150>;
     </tr>
      <tr> <td><form action=addcart.php method=post><input type=label name=add value=<?php  echo $row["name"] ?> >
             </tr></font>
  <tr><td><font size=5 color="black">Price :<?php echo $p=$row["price"]?></tr>
<tr><td><center><input type=submit value=AddCart></center></form></tr></table>
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