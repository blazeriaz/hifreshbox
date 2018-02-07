<?php
$userData = ["username" => "riaintouch+222@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));

$token = curl_exec($ch);
$reviews = array(
				array(
						'productId' => 	2121,					
						'nickname' => 'nickname sample',					
						'title' => 'test title',				
						'detail' => 'test detail',
						'customerId'=> 113,
						'ratingValue' => 4,					
						'storeId' => 1,	
						'weekNo' => 6,
						'year'	=>'2018'
				),
				array(
						'productId' => 	2122,					
						'nickname' => 'nickname sample new',					
						'title' => 'test title',				
						'detail' => 'test detail',
						'customerId'=> 113,
						'ratingValue' => 4,					
						'storeId' => 1,	
						'weekNo' => 6,
						'year'	=>'2018'
				)
				);


						
$review_data = json_encode([
					'reviews' => $reviews
					
						]);
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/review/custom/post");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $review_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);



echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
