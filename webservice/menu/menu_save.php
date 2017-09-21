<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
//$ch = curl_init("http://127.0.0.1/magento/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);




/* =====================Add Single recipe ========================================= */
$single_menu = json_encode(['menu' => [
						'product_sku' => 'freshbox-subscription',
						'week_no' => '13',						
						'week_year' => '2017',						
						'recipe_sku' => '123',						
						'menu_type' => 'week',	
						]]);
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/menu");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $single_menu);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$menu_result = curl_exec($ch);					
echo '<pre>';
var_dump($menu_result);
//print_r(json_decode($menu_result)); 
echo '</pre>';

/* ==========================End Single Menu ==========================================*/


/* =======================For adding Multiple  recipe for menu use the Below Code===========================*/					

/*$slide_array = array('menu'=>array(
							array(
								'product_sku' => $product_result->id,
								'week_no' => '13',						
								'week_year' => '2017',						
								'recipe_sku' => '1',						
								'menu_type' => 'week'	
								),
							array(
								'product_sku' => $product_result->id,
								'week_no' => '13',						
								'week_year' => '2017',						
								'recipe_sku' => '2',						
								'menu_type' => 'week'	
								)
							));
							
$slide_new = json_encode($slide_array);

	
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/menus");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide_new);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$menu_result = curl_exec($ch);*/


/* =====================================End  Multiple Add Menu ==================*/




