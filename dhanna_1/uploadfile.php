<html>
<body>
<?php
   $con=mysql_connect("localhost","root","") or die(mysql_error());
    mysql_select_db('user',$con) or die("Connection Error");
     $name=$_POST['t1'];
     $pwd=$_POST['ufile'];
 $sql="INSERT INTO good(img,tel) VALUES('$name','$pwd')";
   $result=mysql_query($sql);

    if($result==true)
    {
     echo  "<h1><br>Account is created</h1> ";
     }
     else
     {
      echo "<h1><br>Accountis failer </h1>";
     }
$res= mysql_query("SELECT * FROM good");
?>
   <?php
     echo "<table><tr>"; $li=0?>
   <th>cakeslist<td>nameeeee</th>
<?php
             while($row = mysql_fetch_array($res)) 
	{
?>   
 <?php echo "<td>"; ?><table><tr><td><img src="/ <?php   echo $row["tel"] ?>" height=150 width=150>;
     </tr>
      <tr> <td> <?php  echo $row["img"] ?>; 
             </tr></table>
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