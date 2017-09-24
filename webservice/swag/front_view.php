<?php

$sku = '59c4a2150b735';

 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/products/".$sku);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
//curl_setopt($ch,CURLOPT_POSTFIELDS, $productData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);



echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';

echo '=============================Media Gallery with Resized Image ==============';
echo '<br>';


$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/products-gal/".$sku."/media");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
?>