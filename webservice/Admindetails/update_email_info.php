<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$slide = json_encode(['email_address' => [
						'general_contact_name'	=> 'Freshbox General',
						'general_contact_email'  => 'riaintouch+1@gmail.com',
						'sales_representive_name' => 'Freshbox Sales',
						'sales_representive_email'    => 'riaintouch+2@gmail.com',
						'customer_support_name'     => 'Freshbox Support',
						'customer_support_email'  =>'riaintouch+3@gmail.com',       
						]]);
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/emailupdate");

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
