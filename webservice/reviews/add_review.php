<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

	
$review_data =  json_encode([
						'productId' => 	2081,					
						'nickname' => 'nickname',					
						'title' => 'test title',					
						'detail' => 'test detail',					
						'ratingValue' => 4,					
						//'customerId' => 0,					
						'storeId' => 1,	
						'weekNo' => 23,
						]);

 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/review/post");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $review_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);



echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
