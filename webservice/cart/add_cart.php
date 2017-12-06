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
						'product_id' => '2078',						
						'qty' => 1,
						'howmuch_meals_week'=> 1,
						'howmany_people'=> 1,
						'meal_extra_notes'=>'extra',
						'preferences'=> array(
												array('question_id' => 1,'option_id'=>1,'qty'=>2), // Meal Option Id  and quantity
												array('question_id' => 1,'option_id'=>2,'qty'=>1),
												array('question_id' => 2,'option_id'=>5,'qty'=>2),
												array('question_id' => 2,'option_id'=>6,'qty'=>1)
												
										)
						]]);



$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/cart-add");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $n_slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));

$result = curl_exec($ch);

echo '<pre>';
//print_r($result);
print_r(json_decode($result)); 
echo '</pre>'; 
//var_dump($result);
