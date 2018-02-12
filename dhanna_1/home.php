<html><head>
<style>
#frm
{
border:solid gray 1px;
width:65%;
border-radius:5px;
margin:100px auto;
background:white; 
padding:55px;
}
</style>
</head>
<body >
<div id="frm">
<form>
<h1><u>Best Offer in Day  :</u></h1>
<?php
$d=date("D");

if($d=="Mon")
{
    echo" <h1><center>Today is a Nice Monday!</h1></center>";
    echo" <h1><center>Offer in 12% of all product</h1></center>" ;
}
elseif($d=="Tue")
{
     echo"<h1><center>Have a Nice Tuesday!</h1></center>";
echo" <h1><center>Offer in 17% of all product</h1></center>";
}
elseif($d=="Wed")
{
     echo"<h1><center>Have a Nice Wednesday!</h1></center>";
echo" <h1><center>Offer in 13% of all product</h1></center>";
}
elseif($d=="Thu")
{
     echo"<h1><center>Have a Nice Tuesday!</h1></center>";
echo" <h1><center>Offer in 11% of all product</h1></center>";
}
elseif($d=="Fri")
{
     echo"<h1><center>Have a Nice Friday!</h1></center>";
echo"<h1><center>Offer in 22% of all product</h1></center>";
}
elseif($d=="Sat")
  {
         echo"<h1><center>Have a Nice Saterday!</h1></center>";
echo"<h1><center>Holiday Offer in 35% of all product</h1></center>";
  }
  elseif($d=="Sun")
   {  echo"Today is  a Nice Sunday!</h1></center>";
echo"Holiday Offer in 23% of all product</h1></center>";
   }
   ?>
</form>
</body>
</html>