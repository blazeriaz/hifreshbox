<?php


$customerData = [
    'confirmationKey' => "8114f821ae11834d59c96a82f17de416",
    'customerId' => "58"
];

$email_user = 58; 
$url = "http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customers/activateuser";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($customerData));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);