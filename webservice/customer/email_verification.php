<?php


$customerData = [
    'confirmationKey' => "934618826da62686132b6c5ca13d9cd3"
];

$email_user = urlencode('riaintouch+9@gmail.com'); 
$url = "http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customers/".$email_user.'/activateuser';
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