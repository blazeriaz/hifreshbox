<html>
<head>
<style>
#frm
{
border:solid gray 1px;
width:40%;
border-radius:5px;
margin:100px auto;
background:silver;  
padding:40px;
}
</style>
</head>
<body >
<div id="frm">
<form method=post action="new.php">
<center><font color="black">

<h3>
<img src="now.jpg"  class="sign" width="100" height="100"></img></center><br>
<table align=center bgcolor="silver">
<tr><td width="147">Enter Your Name :<td width="222"> <input type=text name=name  placeholder="Name"></tr>
<tr><td width="147">Enter Your City :<td width="222"> <input type=text name=city  placeholder="cityName"></tr>

<tr><td width="147">Contact No  :          <td width="222">    <input type=text name=no  placeholder="Number"></tr>
<tr><td width="147">UserName   : <td width="222">  <input type=text name=user  placeholder="UserName"></tr>
<tr><td width="147">PassWord    :       <td width="222">       <input type=password name=pass  placeholder="Password"></tr>
</table>
<br>
<center>
<input type=submit value=submit>
<br><br>
<a href="log.php">GO BACK</a>
</div>
</form>
</body>
</html>