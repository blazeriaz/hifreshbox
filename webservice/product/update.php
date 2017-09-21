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
        'name'              => 'update Product ' . uniqid(),
        'visibility'        => 4, /*'catalog',*/
        'type_id'           => 'simple',
        'price'             => 0.00,
        'status'            => 1,
        'attribute_set_id'  => 16,
        'weight'            => 1,
		"extension_attributes"=> [
            "stock_item"=> [
                "manage_stock"=> 0,
                "is_in_stock"=> 1,
                "qty"=> "0"
            ]],
        'custom_attributes' => array(
            array( 'attribute_code' => 'category_ids', 'value' => ["41"] ),
            array( 'attribute_code' => 'description', 'value' => 'Simple Description updated' ),
            array( 'attribute_code' => 'short_description', 'value' => 'Simple  Short Description' ),
            array( 'attribute_code' => 'chef_name', 'value' => 'Rafsan Chef updated' ),
            array( 'attribute_code' => 'servings', 'value' => '2 people updated' ),
            array( 'attribute_code' => 'cooking_time', 'value' => '20 minutes updated' ),
            array( 'attribute_code' => 'pdf_upload', 'value' => '123.pdf' ),
            array( 'attribute_code' => 'ingredients', 'value' => 'ingredients test' ),
            array( 'attribute_code' => 'steps', 'value' => 'step 1 updated content###Step 2 content###Step3 Content' ),
            )
    );
	
    $productData = json_encode(array('product' => $productData));
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/all/V1/products/5992a98ad9633");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch,CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

// Adding Images to the Product
/*$base_64_image_content = base64_encode(file_get_contents('sample.png'));
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
 
 $ch = curl_init("http://127.0.0.1/magento/index.php/rest/V1/products/".$sku."/media");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $imageData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$image_result = curl_exec($ch);
*/
echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
