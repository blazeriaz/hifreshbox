<html>
<body>
<?php
//if(isset($_POST["submit"]))
//{
    $name=$_POST['name'];
    $city=$_POST['city'];
     $no=$_POST['no'];
    $user=$_POST['user']; 
    $pass=$_POST['pass'];
 $con=mysql_connect("localhost","root","") or die(mysql_error()); 
    mysql_select_db('ready2',$con) or die("cannot be selected");
 $query=mysql_query("SELECT * FROM sign WHERE user ='".$user."'");
  $numrows=mysql_num_rows($query);
if($numrows==0)
{
    $sql="INSERT INTO sign (name,city,no,user,pass) VALUES ('$name','$city','$no','$user','$pass')";
   
   $result=mysql_query($sql);

    if($result==true)
    {
     echo  "<h1><br>Account is created</h1> ";
     }
     else
     {
      echo "<h1><br>Account is failer </h1>";
     }
}
else
{
echo"<h1><br>The UserName already exits !. please try again with another name.</h1>";
}
/* else
 {
     echo "Reply your Page";
 }*/
 ?>
<a href="log.php">Back to Home</a>
 </body>
</html>