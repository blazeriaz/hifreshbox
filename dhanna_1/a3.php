<html>
<head>
<style>
#frm
{
border:solid gray 1px;
width:65%;
border-radius:5px;
margin:100px auto;
background:white; 
padding:45px;
}
</style>
</head>
<body >
<div id="frm">
<form action="entry.php" method="post"enctype="multipart / form_data">

<table>
<th ><td><h1><u>Sarees Entry</h1></u>
<tr><td>Saree Name :<td><input type=text name=t1>
</tr>
<tr><td>Saree Icon(or)Image :<td><input type="file" name="ufile"/>
</tr>
<tr><td>Saree Categary :<td><select  name="t2" multiple>
<option value="Cotton">cotton</option>
<option value="fancy">fancy</option>
<option value="designer">designer</option>
<option value="silk">silk</option>
<option value="wedding">wedding</option>
</select>
</tr>
<tr><td>Price Of Saree<td><input type=text name=price></tr>
<tr colspan=2><td><input type=submit>
</tr></table>
</form>
</div></body>
</html>