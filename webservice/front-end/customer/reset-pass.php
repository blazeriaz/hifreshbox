<?php

$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/customer/reset-password/riaintouch+011@gmail.com/0fcecbf046e75b80197aa4a6660aa67e/Riaz@123");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET"); // Put method
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailcontent));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));

$result = curl_exec($ch);

$result = json_decode($result);
echo '<pre>';print_r($result);