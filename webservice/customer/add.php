<?php
$userData = array("username" => "freshbox", "password" => "abc@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$custom_attribute[] =  array('attribute_code'=>'customer_number','value'=>'888888888');

$customerData = [
    'customer' => [
        "email" => "riaintouch+74@gmail.com",
        "firstname" => "Md",
        "lastname" => "Rafsan",
        "storeId" => 1,
        "websiteId" => 1,
		"custom_attributes" => $custom_attribute
    ],
    "password" => "Admin@123"
	
];
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customers");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($customerData));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);