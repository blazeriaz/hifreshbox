<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://localhost/magento/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$productData = array(
        'sku'               => 'ZZZ simple 1  ' . uniqid(),
        'name'              => 'Simple Product ' . uniqid(),
        'visibility'        => 4, /*'catalog',*/
        'type_id'           => 'simple',
        'price'             => 99.95,
        'status'            => 1,
        'attribute_set_id'  => 4,
        'weight'            => 1,
		"extension_attributes"=> [
            "stock_item"=> [
                "manage_stock"=> 1,
                "is_in_stock"=> 1,
                "qty"=> "10"
            ]],
        'custom_attributes' => array(
            array( 'attribute_code' => 'category_ids', 'value' => ["3"] ),
            array( 'attribute_code' => 'description', 'value' => 'Simple Description' ),
            array( 'attribute_code' => 'short_description', 'value' => 'Simple  Short Description' ),
            )
    );

    $productData = json_encode(array('product' => $productData));
 
$ch = curl_init("http://localhost/magento/index.php/rest/V1/products");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);