<html>
<head>
<style>
body
{
 //background-image:url("116.gif") ;
background-size:110%;
}

#frm
{
border:solid gray 0.5px;
width:35%;
border-radius:5px;
margin:100px auto;
font-color:white;
background: silver;  
padding:45px;
}
</style>
</head>
<body>
<div id="frm">
<form method=post action="login.php">
<center>
<u>LOGIN </u>
   <br><br>

<img src="b2.png"  class="login" width="100" height="100"></img></center><br>
<font face=Comic Sans MS size=3 color="">
<table width="300" border="0"cellspacing="10" bgcolor="silver">
<tr>
    <td width="147">UserName  :</td>
    <td width="222"><input type=text name=name placeholder="UserName" required=" "></td>
  </tr>
<tr>
    <td width="147">PassWord  :</td>
    <td width="222"><input type=password  name=pass placeholder="Password" required=" "></td>
  </tr>
<br><br><br>
</font></table>
 <br> <center> <input type=submit  value=Login><br><br>
<a href=sign.php><u>NewUsers Registers!</u></a></center>
</font>
</center>
</div>
</form>
</body>
</html>