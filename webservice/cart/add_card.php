<?php
$n_slide = json_encode(['customer_id' => '15',
					'card_number'=>'4111111111111111',
					'cvv'=>'123',
					'month'=>'12',
					'year'=>'22',
					'make_payment'=>1
					]);



$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/add_card.php");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $n_slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));

$result = curl_exec($ch);

echo '<pre>';
//print_r($result);
print_r(json_decode($result)); 
echo '</pre>'; 
//var_dump($result);
