<?php
$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));

$token = curl_exec($ch);

$n_slide = json_encode(['wallet' => [
						'customer_id' => 15,
						'order_id' => '10001',						
						'is_redeemed' => 0,
						'redeemed_user'=> 0,
						'redeemed_code'=> 'riaz1234',
						'from_name'=>'mohammed riaz',
						'to_first_name'=>'umar',
						'to_last_name'=>'rafsan',
						'to_email'=>'riaintouch@gmail.com',
						'message'=>'This is riaz',
						'amount'=>50
						
						]]);

						
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customer-wallet");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $n_slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
//print_r($result);
print_r(json_decode($result)); 
echo '</pre>'; 
//var_dump($result);
