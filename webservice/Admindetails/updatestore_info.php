<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$slide = json_encode(['siteinfo' => [
						'name'	=> 'Freshbox updated',
						'phone'  => '12345678901',
						'hours' => '9 am to 8pm',
						'country_id'    => 'US',
						'region_id'     => '21',
						'postcode'  =>'96712',       
						'city' => 'Haleiwa',
						'street_line1' => 'Address Line 1',
						'street_line2' => 'Address Line 1',
						]]);
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/updatesiteinfo");

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);
echo '<pre>';
print_r($result);
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
