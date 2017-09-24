<?php
$emailcontent = [
    "email"=> "riaintouch+011@gmail.com",
    "template" => "email_reset", // Using template email reset
    "websiteId" => 1
];



$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/customers/password");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT"); // Put method
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailcontent));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));

$result = curl_exec($ch);

$result = json_decode($result, 1);
echo '<pre>';print_r($result);