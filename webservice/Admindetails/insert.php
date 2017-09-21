<?php
$userData = array("username" => "freshbox", "password" => "abc@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);
$node = 'root'; // L2NvbGxlY3Rpb24-

$slide = json_encode(['image_data' => [
						'filename'	=> 'c2FtcGxlLnBuZw--',
						'node'  => $node,
						'store' => '',
						'as_is'    => '1'
						]]);
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/media-insert?node=".$node);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);
echo '<pre>';
print_r($result);
echo '<br>';
echo '<br>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
