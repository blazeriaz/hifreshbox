<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
//$ch = curl_init("http://127.0.0.1/magento/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);


$subscription_product_id = 2078;

/* =====================Add Single Menu ========================================= */
$single_menu = json_encode(['menu' => [
						'product_id' => $subscription_product_id,
						'week_no' => '13',						
						'week_year' => '2017',						
						'recipe_id' => '1',						
						'menu_type' => 'week updated',	
						]]);
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/menu/1");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, $single_menu);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$menu_result = curl_exec($ch);					
echo '<pre>';
var_dump($menu_result);
//print_r(json_decode($menu_result)); 
echo '</pre>';

/* ==========================End Single Menu ==========================================*/




