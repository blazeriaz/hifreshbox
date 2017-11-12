<?php
$n_slide = json_encode(['cartItem' => [
						'quote_id' => 'dd707af157a08e47712ded870b8571ca',
						'sku' => '70009',						
						'qty' => 1,
						
						]]);



$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/guest-carts/dd707af157a08e47712ded870b8571ca/items");
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
