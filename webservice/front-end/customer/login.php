<?php

$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));

$token = curl_exec($ch);

//Get customer info
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/customers/me");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET"); // Get method
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));

$result = curl_exec($ch);

$result = json_decode($result, 1);

echo '<pre>';print_r($result);

$address_dat[] = array(
				'region_id'=>32,
				'country_id'=>'US',
				'street'=> array('Address line updated 1','address line updated 2'),
				'firstname'=>'Mohammed',
				'lastname'=>'Riaz',
				'company'=>'DEF Manufacturing',
				'telephone'=>'555-555-5555',
				'city'=>'1',
				'postcode'=>'02115',
				'default_shipping'=>true,
				'default_billing'=>true
				);

$data_address_new = array(
					'customer'=>array(
						'email'=>$result['email'],
						'firstname'=>$result['firstname'],
						'lastname'=>$result['lastname'],
						'websiteId'=>$result['website_id'],
						'addresses'=> $address_dat,
							)
						);

$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customers/me");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data_address_new));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
