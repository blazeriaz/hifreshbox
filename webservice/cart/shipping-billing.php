<?php
$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
$token = curl_exec($ch);

$n_slide = json_encode(['addressInformation' => [
						'shipping_address' => [
								'region' => 'Hawaii',
								'region_id' => 21,
								'region_code' => 'HI',
								'country_id' => 'US',
								'street'=> array('123 Oak Ave'),
								'postcode'=>'96701',
								'city'=>'Aiea',
								'firstname'=> 'mohammed',
								'lastname'=>'riaz',
								'email'=>'riaintouch@gmail.com',
								'telephone'=> '9566220411'
								],
						'billing_address' => [
								'region' => 'Hawaii',
								'region_id' => 21,
								'region_code' => 'HI',
								'country_id' => 'US',
								'street'=> array('123 Oak Ave'),
								'postcode'=>'96701',
								'city'=>'Aiea',
								'firstname'=> 'mohammed',
								'lastname'=>'riaz',
								'email'=>'riaintouch@gmail.com',
								'telephone'=> '9566220411'
								],
						'shipping_carrier_code'=> 'tablerate',
						'shipping_method_code'=>'bestway'
								
							]
						]);
						


$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/carts/mine/shipping-information");
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
