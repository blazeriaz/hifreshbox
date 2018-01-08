<?php
error_reporting(E_ALL | E_STRICT); 

use Magento\Framework\App\Bootstrap;

require __DIR__ . '/app/bootstrap.php';
require 'vendor/braintree/braintree_php/lib/Braintree.php';
 
$params = $_SERVER;
 
$bootstrap = Bootstrap::create(BP, $params);
 
$obj = $bootstrap->getObjectManager();
 
$state = $obj->get('Magento\Framework\App\State');
$state->setAreaCode('frontend');


// Braintree library
//require 'lib/Braintree.php';

$params = array(
	"testmode"   => "on",
	"merchantid" => "ykh7z4p43k244f7z",
	"publickey"  => "cydtqkfv5ny233zh",
	"privatekey" => "6bf4d26a41bf63551878771aaef819bc",
);

if ($params['testmode'] == "on")
{
	Braintree_Configuration::environment('sandbox');
}
else
{
	Braintree_Configuration::environment('production');
}

Braintree_Configuration::merchantId($params["merchantid"]);
Braintree_Configuration::publicKey($params["publickey"]);
Braintree_Configuration::privateKey($params["privatekey"]);

$post_data = (array)json_decode(file_get_contents("php://input"));

if(isset($post_data['customer_id']))
{
	
				
		
	
$customerID = $post_data['customer_id'];

$objectManager = \Magento\Framework\App\ObjectManager::getInstance();

$customerObj = $objectManager->create('Magento\Customer\Model\Customer')->load($customerID);
$customer_data = $customerObj->getData();

	// Customer details
	$customer_firstname   = $customer_data['firstname'];
	$customer_lastname    = $customer_data['lastname'];
	$customer_email       = $customer_data['email'];
	$customer_phonenumber = '';
	// EOF Customer billing details

	// Credit Card Details
	$card_number = $post_data['card_number'];
	$cvv         = $post_data['cvv'];
	$exp_date_month = $post_data['month'];
	$exp_date_year = $post_data['year'];
	
	
	//'braintree'.'card'.{"type":"VI","maskedCC":"0004","expirationDate":"12\/2022"}
	
	//exit;
	// EOF Credit Card Details

	// Create customer in braintree Vault
	$result = Braintree_Customer::create(array(
		'firstName' => $customer_firstname,
		'lastName'  => $customer_lastname,
		'phone'     => $customer_phonenumber,
		'email'     => $customer_email,
		'creditCard' => array(
			'number'          => $card_number,
			'cardholderName'  => $firstname . " " . $lastname,
			'expirationMonth' => $exp_date_month,
			'expirationYear'  => $exp_date_year,
			'cvv'             => $cvv
			
		)
	));

	if ($result->success) {
		
		$braintree_cust_id = $result->customer->id;
		$paymentMethods = $result->customer->paymentMethods; 
		$last_4_digit = $paymentMethods[0]->last4;
		$expirationYear = $paymentMethods[0]->expirationYear;
		$expirationMonth = $paymentMethods[0]->expirationMonth;
		$expirationDate = $paymentMethods[0]->expirationDate;
		$cardType = $paymentMethods[0]->cardType;
		$gateway_token = $paymentMethods[0]->token;
		 
		 $typ = $cardType;
		 if($cardType == 'Visa'){
			 $typ = 'VI';
		 }
				
		$year = $expirationYear;
		$month = $expirationMonth;
		$day = '01';
		$join_date = $year.'-'.$month.'-'.$day;
		$start_date = date_create($join_date);
		$lastday = date('t',strtotime($start_date));
		
		$expiry_last_date = $year.'-'.$month.'-'.$lastday;
		$create_last = date_create($expiry_last_date);
		$expiry_date_l = date_format($create_last,"Y-m-d H:i:s");
		
		
		
		$details = json_encode(array('type'=>$cardType,'maskedCC'=>$last_4_digit,'expirationDate'=>$expirationDate));
		$sting_enc = time().'braintree'.'card'.$details;
		$public_hash = md5($sting_enc);
		 $payment_method = 'braintree';
	$type = "card";
	$expires_at = $expiry_date_l;
	 $servername = "localhost";
$username = "freshbox";
$password = "0q5!7J8f3%IJ";
$dbname = "freshbox";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection

	$sql = "INSERT INTO vault_payment_token(customer_id, public_hash,payment_method_code,type,expires_at,gateway_token,details,is_active,is_visible) VALUES (".$customerID.",'".$public_hash."','".$payment_method."','".$type."','".$expires_at."','".$gateway_token."','".$details."','1','1')";

	if ($conn->query($sql) === TRUE) {
	$last_id = $conn->insert_id;
	$select_query = "select * from braintree_default_card where user_id=".$customerID;
	$default_card_result = $conn->query($select_query);
		if ($default_card_result->num_rows == 0) {
			$insert_query = "INSERT INTO braintree_default_card(user_id,card_id)values(".$customerID.",".$last_id.")";
			$conn->query($insert_query);
		}

    echo $public_hash;
	} else {
    echo "Error : ".$conn->error;
	}
	
	} else {
		echo "Error : ".$result->message;
	}
	
	//$braintree_cust_id = $result->customer->paymentMethods; 
	//echo '<pre>';
	//print_r($result);

	

}

?>
