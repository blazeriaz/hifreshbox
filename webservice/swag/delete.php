<?php
$userData = array("username" => "freshbox", "password" => "abc@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$sku = 5992a98ad9633;
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/all/V1/products/5992a98ad9633".$sku);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
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
