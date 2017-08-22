<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);
$sku = uniqid();
$productData = array(
        'sku'               => $sku,
        'name'              => 'Swag Product ' . uniqid(),
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
            array( 'attribute_code' => 'description', 'value' => 'Simple Description' ),
            array( 'attribute_code' => 'short_description', 'value' => 'Simple  Short Description' ),
            array( 'attribute_code' => 'order_shipping', 'value' => 'Order and shipping Description' ),
            array( 'attribute_code' => 'return_policy', 'value' => 'REturn policy Description' ),
            
            )
    );
	
    $productData = json_encode(array('product' => $productData));
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/default/V1/products");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

// Adding Images to the Product

$base_64_image_content = base64_encode(file_get_contents('sample.png'));
$image_array = array('entry'=>array(
								'media_type'=>'image',
								'label'=>'my image',
								'position'=>0,
								'disabled'=>0,
								'types'=>array('image','small_image','thumbnail','swatch_image'),
								'file'=>'sample.png',
								'content'=>array(
											'base64_encoded_data'=>$base_64_image_content,
											'type'=>'image/png',
											'name'=>'sample.png',
											),
								)
								);
								
 $imageData = json_encode($image_array);
 
 
 $ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/default/V1/products/".$sku."/media");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $imageData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$image_result = curl_exec($ch); 

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
