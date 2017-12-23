<?php
$userData = array("username" => "freshbox", "password" => "abc@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);
$payload ='
{
  "items": [
    {
      "extension_attributes": {},
      "order_item_id": 268,
      "qty": 1
    }
  ],
  "notify": true,
  "appendComment": true,
  "comment": {
    "extension_attributes": {},
    "comment": "this is my comment",
    "is_visible_on_front": 1
  },
  "tracks": [
    {
      "extension_attributes": {},
      "track_number": "123456",
      "title": "my carrier code",
      "carrier_code": "custom"
    }
  ],
  "packages": [
    {
      "extension_attributes": {}
    }
  ],
  "arguments": {
    "extension_attributes": {}
  }
}';

/*
$extension_attribute = array();
$n_slide = json_encode([
				'items' => [
					[
						'order_item_id'=>268,
						'qty'=>1
						]
				],
				 'notify'=>true,
				 'appendComment'=>true,
				 'comment'=>[
						[
						'comment'=>'this is comment',
						'is_visible_on_front'=>1
						]
				 ],
				'tracks'=>[
						[
						 'track_number'=> "Mytrackingno123",
						 'title'=>'My carriertile',
						 'carrier_code'=>'custom'
						]
				]
				
				]);*/


//exit;

$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/order/245/ship");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));

$result = curl_exec($ch);

echo '<pre>';
//print_r($result);
print_r(json_decode($result)); 
echo '</pre>'; 
//var_dump($result);
