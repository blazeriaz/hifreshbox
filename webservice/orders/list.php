<?php
//$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$userData = ["username" => "freshbox", "password" => "abc@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
$token = curl_exec($ch);
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/orders?searchCriteria[pageSize]=10&searchCriteria[current_page]=1&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC" );
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);