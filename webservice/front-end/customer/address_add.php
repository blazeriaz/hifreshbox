<?php

$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));

$token = curl_exec($ch);


$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customers/me");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data_address_new));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);



echo '<pre>';
print_r(json_decode($result)); 

echo '</pre>';


$address_dat[] = array(
				'region_id'=>32,
				'country_id'=>'US',
				'street'=> array('Address line updated 1 new','address line updated 2 new'),
				'firstname'=>'Mohammed',
				'lastname'=>'Riaz',
				'company'=>'DEF Manufacturing',
				'telephone'=>'555-555-5555',
				'city'=>'1',
				'postcode'=>'02115',
				'default_shipping'=>true,
				'default_billing'=>false
				);

$slide = json_encode(['newaddress' => [
						'customer_id'=> 15,
						'firstname'=>'Rafsan',
						'lastname'=>'Roshan',
						'country_id'=>'US',
						'region_id'=> 32,
						'post_code'=>'10000',
						'city'=>'HaNoi',
						'telephone'=>'9566220411',
						'fax'=>'123456789',
						'company'=>'company',
						'street'=>array('Address line updated 1','address line updated 2'),
						'is_default_shipping'=>0,
						'is_default_billing'=>0
						]]);
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customer/addnewaddress/15");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$results = curl_exec($ch);

echo '<pre>';

print_r(json_decode($results)); 
echo '</pre>';
