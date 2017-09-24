<?php

$slide = json_encode(['email' => 'riaintouch+011@gmail.com',
					'resetToken'=>'0fcecbf046e75b80197aa4a6660aa67e',
					'newPassword'=>'Riaz@123']);
						
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customer/reset-password");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);
echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
