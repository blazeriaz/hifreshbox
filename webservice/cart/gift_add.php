<?php
$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));

$token = curl_exec($ch);

$slide = json_encode([
						'customer_id' => 15
						
						]);
						
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/carts/mine");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
 $quote_id = curl_exec($ch);
 
 $quote_id_c = json_decode($quote_id);

$n_slide = json_encode(['cart_item' => [
						'quote_id' => $quote_id_c,
						'sku' => 'freshbox-gift',						
						//'sku' => '29645',						
						//'product_id' => '2057',						
						'qty' => 1,
						'productOption'=>[
							'extensionAttributes'=> array(
								'customOptions'=>array(
											array('optionId'=>13,'optionValue'=>23), //gift amount 50 amount => 23 value / 24 =>100/ 25=>150/ 26=>200
											array('optionId'=>14,'optionValue'=>27), // Gift Delivery  27 => Email / 28 => Print
											array('optionId'=>15,'optionValue'=>'From Name'), // From Name 15 => userdefined text
											array('optionId'=>16,'optionValue'=>'recipient first Name'), // recipient first Name 16 => userdefined text
											array('optionId'=>17,'optionValue'=>'recipient last Name'), // recipient last Name 17 => userdefined text
											array('optionId'=>18,'optionValue'=>'recipient email'), // recipient email 18 => userdefined text
											array('optionId'=>19,'optionValue'=>'message'), // message  19 => userdefined text
											
											)
										)
							]
						]]);
						


$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/carts/mine/items");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $n_slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));


/*
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/cart-add");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $n_slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
*/
$result = curl_exec($ch);

echo '<pre>';
print_r($result);
print_r(json_decode($result)); 
echo '</pre>'; 
//var_dump($result);
