<html>
<body background="com.jpg">
<?php
    $n1=$_POST['n1'];
    $n2=$_POST['n2'];
    $n3=$_POST['n3'];
    $n4=$_POST['n4']; 
    $n5=$_POST['n5'];
 $conn=mysql_connect("localhost","root","") or die(mysql_error()); 
   $re= mysql_select_db('ready2',$conn) or die("cannot be selected");
    $sql="INSERT INTO `orders`(`name`,`hname`,`address`,`lanmark`,`num`) VALUES('$n1','$n2','$n3','$n4','$n5')";
  $result=mysql_query($sql);

    if($result==true)
    {
     echo  "<h1><center><font color=tomato><br>Order Are Booked.Delivery On Next 3 Hours !</h1></center></font> ";
     }
     else
     {
      echo "<h1><br>Order Are Not Booked . Please Try Again !</h1>". die(mysql_error());
     ?>
     <a href="home.php">GO Back</a>
     <?php
     }
     ?>
     </body>
     </html>