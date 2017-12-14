<?php
$n_slide = json_encode(['recurring' => [
						'parent_order_id'=>4,
						'order_id' => '000000053',
						'user_id'=>15,
						'is_active' => 1,
						'sort_order' => 1
						]
						]);
						
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/recurring");
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
