<?php
$userData = array("username" => "freshbox", "password" => "abc@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

// Adding Images to the Product

$base_64_pdf_content = base64_encode(file_get_contents('pdf-sample.pdf'));
$image_array = array('pdfdata'=>array(
								'media_type'=>'pdf',
								'label'=>'my pdf',
								'file'=>'pdf-sample.pdf',
								'product_id'=> '2099',
								'content'=>array(
											'base64_encoded_data'=>$base_64_pdf_content,
											'type'=>'application/pdf',
											'name'=>'pdf-sample.pdf',
											),
								)
								);
								
 $pdfData = json_encode($image_array);
 
 
 $ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/freshboxrecipespdf");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch,CURLOPT_POSTFIELDS, $pdfData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$image_result = curl_exec($ch); 

echo '<pre>';
print_r(json_decode($image_result)); 
echo '</pre>';
//var_dump($result);
