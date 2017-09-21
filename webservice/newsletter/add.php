<?php
$slide = json_encode(['email' => 'md.riaz.samsys+102@gmail.com']);
 
$ch = curl_init("freshbox.white-space-studio-dev.com/api/index.php/rest/V1/newsletter/add" );
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);