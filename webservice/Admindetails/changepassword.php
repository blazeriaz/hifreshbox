<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);
$userId = 3;
$slide = json_encode(['adminsettings' => [
						'user_id'	=> $userId,
						'username'  => 'umar',
						'firstname' => 'mohammed riazzz',
						'lastname'    => 'rafsan ed',
						'email'     => 'riaintouch+9@gmail.com',
						'password'  =>'admin@123',       
						'interface_locale' => 'en_US',
						'is_active' => 1
						]]);

						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/adminsettings");

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);
echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
