<?php
$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
$token = curl_exec($ch);

$n_slide = json_encode(['paymentMethod' => [
						'method' => "braintree_cc_vault",
						'additional_data'=> [
							  //"payment_method_nonce"=>"39c3239f-ba4c-0ee6-718f-39df3a7d07ff", 
							  "payment_method_nonce"=>"3cad5e88-3a1a-0559-55ee-a7d5e794fd48", 
							  "public_hash"=>"9b2427a7fa90d984ad978f217711b29619fa1651d74eb524b5631f7546688c58",
							  "is_active_payment_token_enabler"=>true
							 
						],
						],
						'billing_address' => [
								'region' => 'Alaska',
								'region_id' => 2,
								'region_code' => 'AK',
								'country_id' => 'US',
								'street'=> array('mosque street'),
								'postcode'=>'99501',
								'city'=>'chennai',
								'firstname'=> 'md',
								'lastname'=>'riaz',
								'email'=>'riaintouc008@gmail.com',
								'telephone'=> '9566220411',
								'customer_address_id'=>38,
								'customer_id'=>15,
								//'id'=>1129,
								'same_as_billing'=>1,
								'save_in_address_book'=>1,
								
								]
						]);
						
//echo $n_slide;exit;

$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/carts/mine/payment-information");
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
