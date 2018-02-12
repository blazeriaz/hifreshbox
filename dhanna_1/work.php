<html>
<body>
<?php
  $con=mysql_connect("localhost","root","") or die(mysql_error());
    mysql_select_db('ready2',$con) or die("Connection Error");
     $sql1="SELECT * FROM stock WHERE cate='Cakes' ";
     $res= mysql_query($sql1);
     if(!$res)
     {
       echo "hello not";
     }
     else{
       echo "VAralam";
     }
?>
       <?php
     echo "<table><tr>"; $li=0?>
<?php
             while($row = mysql_fetch_array($res)) 
	{
        echo "<td>";
?>   
 <table align=center>
  <tr><td align=center><font size=14 color="blue"> 
<?php 
  // echo $x= $row["name"];
?> 
             </font></tr>
  <tr><td><font size=5 color="cyan">
  <?php
  echo   $row["price"];
 ?>
</tr>
<tr><td><center><form name=f method="post" action="addcart.php"><font size=14 color=red><input type=label name=add value=<?php echo $row["name"] ?>><br><input type="submit" value="AddCart"></form></font></center></tr></table>
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