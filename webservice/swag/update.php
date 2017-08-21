<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);
$sku = '599b24d693abf'; //  sku of an product
$productData = array(
        'name'              => 'update swag ' . uniqid(),
        'visibility'        => 4, /*'catalog',*/
        'type_id'           => 'simple',
        'price'             => 18.00,
        'status'            => 1,
        'attribute_set_id'  => 17,
        'weight'            => 1,
		"extension_attributes"=> [
            "stock_item"=> [
                "manage_stock"=> 0,
                "is_in_stock"=> 1,
                "qty"=> "100"
            ]],
        'custom_attributes' => array(
            array( 'attribute_code' => 'category_ids', 'value' => ["42"] ),
            array( 'attribute_code' => 'description', 'value' => 'update Description updated' ),
            array( 'attribute_code' => 'short_description', 'value' => 'update  Short Description' ),
            
            )
    );
	
    $productData = json_encode(array('product' => $productData));
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/default/V1/products/".$sku);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch,CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);


echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
