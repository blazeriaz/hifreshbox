<?php
use Magento\Framework\App\Bootstrap;

require __DIR__ . '/app/bootstrap.php';

$bootstrap = Bootstrap::create(BP, $_SERVER);

$obj = $bootstrap->getObjectManager();

$state = $obj->get('Magento\Framework\App\State');
$state->setAreaCode('frontend');

//$quote = $obj->get('Magento\Checkout\Model\Session')->getQuote()->load(1);
$userId = 3;
 $adminInfo = [
		'user_id'	=> $userId,
        'username'  => 'umar',
        'firstname' => 'mohammed ed',
        'lastname'    => 'rafsan ed',
        'email'     => 'riaintouch+5@gmail.com',
        'password'  =>'riaz@123',       
        'interface_locale' => 'en_US',
        'is_active' => 1
    ];
	
$userModel  = $obj->get('\Magento\User\Model\UserFactory')->create();
/*$user_data = $userModel->load($userId)->getData();
echo '<pre>';
print_r($user_data);
echo '</pre>';*/
 $userModel->setData($adminInfo);
  $userModel->setRoleId(1);
   try{
       $userModel->save(); 
    } catch (\Exception $ex) {
        echo $ex->getMessage();
    }
	echo "hi";
//print_r($quote->getOrigData());
?>
