<?php
$userData = array("username" => "freshbox", "password" => "abc@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$slide = json_encode(['meals' => [
						'title' => 'which of the following do you prefer ?',
						'is_active' => 1
						
						]]);
						
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/meals");
//$ch = curl_init("http://127.0.0.1/magento/index.php/rest/V1/meals");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);
echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);