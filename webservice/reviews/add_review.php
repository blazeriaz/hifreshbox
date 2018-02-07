<?php

$review_data =  json_encode([
						'productId' => 	2121,					
						'nickname' => 'nickname sample',					
						'title' => 'test title',				
						'detail' => 'test detail',
						'customerId'=> 113,
						'ratingValue' => 4,					
						'storeId' => 1,	
						'weekNo' => 6,
						'year'	=>'2018'
						]);

 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/review/post");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $review_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
 
$result = curl_exec($ch);



echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
