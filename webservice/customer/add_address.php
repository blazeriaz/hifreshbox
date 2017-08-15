<?php
$userData = array("username" => "admin", "password" => "admin@123");
$ch = curl_init("http://localhost/magento/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$customer_id = 4;

$ch = curl_init("http://localhost/magento/index.php/rest/V1/customers/".$customer_id);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$customer_result = curl_exec($ch);

$customer_details = json_decode($customer_result);
$email = $customer_details->email;
$firstname = $customer_details->firstname;
$lastname = $customer_details->lastname;
$website_id = $customer_details->website_id;

if(count($customer_details->addresses) > 0){
	// Existing Address list
	foreach($customer_details->addresses as $address){
		
		 $street_array = $address->street;
				
		$address_dat[] = array(
				'customer_id'=> $address->customer_id,
				'region_id'=> $address->region_id,
				'country_id'=> $address->country_id,
				'street'=> array($street_array[0],$street_array[1]),
				'firstname'=>$address->firstname,
				'lastname'=>$address->lastname,
				'company'=>$address->company,
				'telephone'=>$address->telephone,
				'city'=>$address->city,
				'postcode'=>$address->postcode,
				);
	}
}

// Adding New Address

$address_dat[] = array(
				'customer_id'=>$customer_id,
				'region_id'=>32,
				'country_id'=>'US',
				'street'=> array('Address line updated 1','address line updated 2'),
				'firstname'=>'Mohammed',
				'lastname'=>'Riaz',
				'company'=>'DEF Manufacturing',
				'telephone'=>'555-555-5555',
				'city'=>'1',
				'postcode'=>'02115',
				);
$data_address_new = array(
					'customer'=>array(
						'email'=>$email,
						'firstname'=>$firstname,
						'lastname'=>$lastname,
						'websiteId'=>$website_id,
						'addresses'=> $address_dat,
							)
						);

$ch = curl_init("http://localhost/magento/index.php/rest/V1/customers/".$customer_id);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data_address_new));
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
