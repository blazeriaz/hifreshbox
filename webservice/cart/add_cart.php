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

 $week_no = 23;
 $meal_preference = 'Meat * 2 ,Pork * 2';
$n_slide = json_encode(['cart_item' => [
						'quote_id' => $quote_id_c,
						'product_id' => '2078',						
						'qty' => 1,
						'options'=> array(20=>$week_no,21=>$meal_preference)
						]]);



$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/cart-add");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $n_slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));

$result = curl_exec($ch);

echo '<pre>';
print_r($result);
print_r(json_decode($result)); 
echo '</pre>'; 
//var_dump($result);