<?php

$userData = ["username" => "riaintouch@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));

$token = curl_exec($ch);

$custom_attribute[] =  array('attribute_code'=>'customer_number','value'=>'6666666666');

$customerData = [
    'customer' => [
		 "id" => 2,
        "email" => "riaintouch@gmail.com",
        "firstname" => "Umar",
        "lastname" => "Rafsan",
        "storeId" => 1,
        "websiteId" => 1,
		"custom_attributes" => $custom_attribute
    ]
   
];

///V1/customers/addresses/{addressId}
//Get customer info
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/customers/me");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT"); // Get method
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($customerData));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));

$result = curl_exec($ch);


echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
