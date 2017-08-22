<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
//$ch = curl_init("http://127.0.0.1/magento/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);


$sku = uniqid();
$productData = array(
        'sku'               => $sku,
        'name'              => 'Menu Product ' . uniqid(),
        'visibility'        => 4, 
        'type_id'           => 'simple',
        'price'             => 72.00,
        'status'            => 1,
        'attribute_set_id'  => 18,
        'weight'            => 1,
		"extension_attributes"=> [
            "stock_item"=> [
                "manage_stock"=> 0,
                "is_in_stock"=> 1,
                "qty"=> "100"
            ]],
        'custom_attributes' => array(
            array( 'attribute_code' => 'category_ids', 'value' => ["43"] ),
            array( 'attribute_code' => 'description', 'value' => 'Simple Description' ),
            array( 'attribute_code' => 'short_description', 'value' => 'Simple  Short Description' ),
            array( 'attribute_code' => 'week_no', 'value' => '12' ),
            array( 'attribute_code' => 'week_year', 'value' => '2017' ),
            array( 'attribute_code' => 'selected_recipes', 'value' => '1,2,3' ),
            array( 'attribute_code' => 'menu_type', 'value' => 'week' ),
            
            )
    );
	
    $productData = json_encode(array('product' => $productData));
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/default/V1/products");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

$product_result = json_decode($result);

// add menu 
						
$slide_array = array('menu'=>array(
							array(
								'product_id' => $product_result->id,
								'week_no' => '13',						
								'week_year' => '2017',						
								'recipe_id' => '1',						
								'menu_type' => 'week'	
								),
							array(
								'product_id' => $product_result->id,
								'week_no' => '13',						
								'week_year' => '2017',						
								'recipe_id' => '2',						
								'menu_type' => 'week'	
								)
							));
							
$slide_new = json_encode($slide_array);

	
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/menus");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide_new);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$menu_result = curl_exec($ch);
echo '<pre>';

print_r(json_decode($menu_result)); 
echo '</pre>';
//var_dump($result);
