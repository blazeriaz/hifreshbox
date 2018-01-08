<?php
namespace Freshbox\Configurations\Model;
use Freshbox\Configurations\Api\ConfigRepositoryInterface;
use Freshbox\Ingredients\Model\ResourceModel\Ingredient\CollectionFactory as IngredientCollectionFactory;
use Freshbox\Portions\Model\ResourceModel\Quantity\CollectionFactory as QuantityCollectionFactory;
use Magento\Framework\App\ResourceConnectionFactory;
use Magento\Framework\Encryption\Helper\Security;
/**
 * Class WebServiceRepository
 * @package Demac\WebService\Model
 */
class ConfigRepository implements ConfigRepositoryInterface
{
    /**
     * @var ResourceConnectionFactory
     */
    protected $_resourceConnection;
	
    /**
     * @var \Magento\User\Model\UserFactory
     */
    protected $userFactory;
	
	/**
     * Cms wysiwyg images
     *
     * @var \Magento\Cms\Helper\Wysiwyg\Images
     */
    protected $_cmsWysiwygImages = null;
	
	/**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry = null;
	
	/**
     * Files collection object
     *
     * @var \Magento\Framework\Data\Collection\Filesystem
     */
    protected $_filesCollection;
	
	


   
    /**
     * SelectRepository constructor.
     *
     * @param ResourceConnectionFactory $_resourceConnection
	 * @param UserFactory $userFactory
	 * @param \Magento\Cms\Helper\Wysiwyg\Images $cmsWysiwygImages
	 
     */
    public function __construct(ResourceConnectionFactory $_resourceConnection,
								\Magento\User\Model\UserFactory $userFactory,
								\Magento\Framework\App\Config\ScopeConfigInterface $setscopeConfig,
								\Magento\Config\Model\ResourceModel\Config $scopeConfig,
								\Magento\User\Model\ResourceModel\User\Collection $userCollection,
								\Magento\User\Helper\Data $helperData,
								\Magento\Cms\Helper\Wysiwyg\Images $cmsWysiwygImages,
								\Magento\Framework\Registry $registry,
								\Magento\Cms\Model\Wysiwyg\Images\Storage $storage		
								)
    {
        $this->_resourceConnection = $_resourceConnection;
        $this->userFactory        = $userFactory;
        $this->_scopeConfig = $scopeConfig;
        $this->setscopeConfig = $setscopeConfig;
		$this->userCollection = $userCollection;
		$this->helperData = $helperData;
		$this->_cmsWysiwygImages = $cmsWysiwygImages;
		 $this->_coreRegistry = $registry;
		  $this->storage = $storage;
		  
		 
    }
    /**
     * @return mixed
     */
    public function getadminsettings($adminsettings)
    {
     $userModel  =  $this->userFactory->create();
	   
	  $userModel->setData($adminsettings);
		$userModel->setRoleId(1);
		try{
       $userModel->save(); 
    } catch (\Exception $ex) {
        return $ex->getMessage();
    }
		return 'success';
		
    }
	/**
     * @return mixed
     */ 
	public function getsiteinformation(){
		
		$store_name =  $this->setscopeConfig->getValue('general/store_information/name', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_phone =  $this->setscopeConfig->getValue('general/store_information/phone', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_hours =  $this->setscopeConfig->getValue('general/store_information/hours', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_country_id =  $this->setscopeConfig->getValue('general/store_information/country_id', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_region_id =  $this->setscopeConfig->getValue('general/store_information/region_id', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_postcode =  $this->setscopeConfig->getValue('general/store_information/postcode', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_city =  $this->setscopeConfig->getValue('general/store_information/city', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_street_line1 =  $this->setscopeConfig->getValue('general/store_information/street_line1', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		$store_street_line2 =  $this->setscopeConfig->getValue('general/store_information/street_line2', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		
		return $store_details['store_information'] = array(
							'store_name'=>$store_name,
							'store_phone'=>$store_phone,
							'store_hours'=>$store_hours,
							'store_country_id'=>$store_country_id,
							'store_region_id'=>$store_region_id,
							'store_postcode'=>$store_postcode,
							'store_city'=>$store_city,
							'store_street_line1'=>$store_street_line1,
							'store_street_line2'=>$store_street_line2
							);
		
	}
	
	/**
     * @return mixed
     */ 
	public function updatesiteinformation($siteinfo){
		
		if($siteinfo['name']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/name', $siteinfo['name'],'default',0);
		}
		if($siteinfo['phone']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/phone', $siteinfo['phone'],'default',0);
		}
		if($siteinfo['hours']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/hours', $siteinfo['hours'],'default',0);
		}
		if($siteinfo['country_id']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/country_id', $siteinfo['country_id'],'default',0);
		}
		if($siteinfo['region_id']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/region_id', $siteinfo['region_id'],'default',0);
		}
		if($siteinfo['postcode']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/postcode', $siteinfo['postcode'],'default',0);
		}
		if($siteinfo['city']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/city', $siteinfo['city'],'default',0);
		}
		if($siteinfo['street_line1']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/street_line1', $siteinfo['street_line1'],'default',0);
		}
		if($siteinfo['street_line2']!=""){
			$this->_scopeConfig->saveConfig('general/store_information/street_line2', $siteinfo['street_line2'],'default',0);
		}
		return true;
	}
	
	/**
     * @return mixed
     */
	public function emailupdate($email_address){
		
		if($email_address['general_contact_name']!=""){
			$this->_scopeConfig->saveConfig('trans_email/ident_general/name', $email_address['general_contact_name'],'default',0);
		}
		if($email_address['general_contact_email']!=""){
			$this->_scopeConfig->saveConfig('trans_email/ident_general/email', $email_address['general_contact_email'],'default',0);
		}
		if($email_address['sales_representive_name']!=""){
			$this->_scopeConfig->saveConfig('trans_email/ident_sales/name', $email_address['sales_representive_name'],'default',0);
		}
		
		if($email_address['sales_representive_email']!=""){
			$this->_scopeConfig->saveConfig('trans_email/ident_general/email', $email_address['sales_representive_email'],'default',0);
		}
		if($email_address['customer_support_name']!=""){
			$this->_scopeConfig->saveConfig('trans_email/ident_support/name', $email_address['customer_support_name'],'default',0);
		}
		if($email_address['customer_support_email']!=""){
			$this->_scopeConfig->saveConfig('trans_email/ident_support/email', $email_address['customer_support_email'],'default',0);
		}
		return true;
	}
	
	/**
     * @return mixed
    */
	public function getemailinformation(){
		$general_contact_name =  $this->setscopeConfig->getValue('trans_email/ident_general/name', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 $general_contact_email =  $this->setscopeConfig->getValue('trans_email/ident_general/email', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 
		 $sales_representive_name =  $this->setscopeConfig->getValue('trans_email/ident_sales/name', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 $sales_representive_email =  $this->setscopeConfig->getValue('trans_email/ident_sales/email', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 
		 $customer_support_name =  $this->setscopeConfig->getValue('trans_email/ident_support/name', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 $customer_support_email =  $this->setscopeConfig->getValue('trans_email/ident_support/email', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 
		  return $email_details = array('general_contact' => 
										array(
											'name'=>$general_contact_name,
											'email'=>$general_contact_email,
										),
								'sales_representative' =>
												array(
													'name'=>$sales_representive_name,
													'email'=>$sales_representive_email,
												),
								'customer_support' =>
												array(
													'name'=>$customer_support_name,
													'email'=>$customer_support_email,
												),
					);
	}
	
	/**
     * @return mixed
    */
	 
	public function forgotemail($email){
		$user_collection = $this->userCollection->addFieldToFilter('email', $email)->load(false);
		try {
			if ($user_collection->getSize() > 0) {
			
			 foreach ($user_collection as $item) {
				 
				$user = $this->userFactory->create()->load($item->getId());
				
				if($user->getId()) {
					$newPassResetToken = $this->helperData->generateResetPasswordLinkToken();
					$user->changeResetPasswordLinkToken($newPassResetToken);
                    $user->save();
                    $user->sendPasswordResetConfirmationEmail();
				}
				  
				 //return $item->getId().'-->'.$item->getEmail();
			 }
			 return true;
			}
		}catch (\Exception $exception) {
			return $exception->getMessage();
                    
        }
		
	}
	
	/**
     * @return mixed
     */
	public function forgotemailvalidate($email_validation){
		
		 $userId =  (int) $email_validation['id'];
		
		$resetPasswordToken =  (string) $email_validation['token'];
		 $error = 0;
		$error_message = '';
		 if (!is_int($userId) || !is_string($resetPasswordToken) || empty($resetPasswordToken) || empty($userId) || $userId < 0) {
			 
            $error = 1;
			$error_message .= 'Please correct the password reset token.';
        }

       
        $user = $this->userFactory->create()->load($userId);
        if (!$user->getId()) {
            $error = 1;
            $error_message .= 'Please specify the correct account and try again.';
            
        }

        $userToken = $user->getRpToken();
        if (!Security::compareStrings($userToken, $resetPasswordToken) || $user->isResetPasswordLinkTokenExpired()) {
           $error = 1;
		   $error_message .= 'Your password reset link has expired.';
        }
		
		if($error > 0){
			//return array('status'=>'error','message'=>$error_message);
			return $error_message;
		}else{
			
			//return array('status'=>'success','message'=>'Valid Email Link');
			return 'success';
		}
		
	}
	
	/**
     * @return mixed
     */
	public function forgotemailchange($email_change_data){
		
		$resetPasswordToken = (string)$email_change_data['token'];
        $userId = (int)$email_change_data['id'];
        $password = (string)$email_change_data['password'];
        $passwordConfirmation = (string)$email_change_data['confirmation'];
		
		 $error = 0;
		$error_message = '';
		 if (!is_int(
            $userId
        ) || !is_string(
            $resetPasswordToken
        ) || empty($resetPasswordToken) || empty($userId) || $userId < 0
        ) {
            $error = 1;
			$error_message .= 'Please correct the password reset token.';
        }

       
        $user = $this->userFactory->create()->load($userId);
        if (!$user->getId()) {
            $error = 1;
            $error_message .= 'Please specify the correct account and try again.';
            
        }

        $userToken = $user->getRpToken();
        if (!Security::compareStrings($userToken, $resetPasswordToken) || $user->isResetPasswordLinkTokenExpired()) {
           $error = 1;
		   $error_message .= 'Your password reset link has expired.';
        }
		
		if($error > 0){
			//return array('status'=>'error','message'=>$error_message);
			return $error_message;
		}else{
			
		$user = $this->userFactory->create()->load($userId);
        $user->setPassword($password);
        $user->setPasswordConfirmation($passwordConfirmation);
        // Empty current reset password token i.e. invalidate it
        $user->setRpToken(null);
        $user->setRpTokenCreatedAt(null);
		 try {
             $errors = $user->validate();
			if ($errors !== true && !empty($errors)) {
               // return array('status'=>'error','Message'=>'Reset Password Failed.Error in form Fields.');
				return 'Reset Password Failed.Error in form Fields.';
            } else {
				$user->save();
				//return array('status'=>'success','Message'=>'You have Resetted the Password Successfully.');
				return 'success';
			}
		 }catch (\Exception $exception) {
			return $exception->getMessage();
                    
        }
			
		}
		
	}
	
	
	/**
     * @return mixed
     */
	public function treestorage($node){
			//return $node['node'];
			//$this->getRequest()->setParam('node', $node);
		 $storageRoot = $this->_cmsWysiwygImages->getStorageRoot();
		  $this->_cmsWysiwygImages->getCurrentPath();
		  $collection = $this->storage->getDirsCollection($this->_cmsWysiwygImages->getCurrentPath());
		
		   $jsonArray = [];
        foreach ($collection as $item) {
            $jsonArray[] = [
                'text' => $this->_cmsWysiwygImages->getShortFilename($item->getBasename(), 20),
                'id' => $this->_cmsWysiwygImages->convertPathToId($item->getFilename()),
                'path' => substr($item->getFilename(), strlen($storageRoot)),
                'cls' => 'folder',
            ];
        }
		
		return $jsonArray;
		
	}
	
	/**
     * @return mixed
     */
	
	public function imagecontents($node){
		
		$this->_filesCollection = $this->storage->getFilesCollection(
										$this->_cmsWysiwygImages->getCurrentPath(),
										'image'
									);
			$jsonArray = [];
		if($this->_filesCollection->count() > 0){
			foreach ($this->_filesCollection as $file){
				
				 $jsonArray[] = [
					'file_id' => $file->getId(),
					'file_thumb_url' => $file->getThumbUrl(),
					'file_name' => $file->getName(),
					'width' => $file->getWidth(),
					'height' => $file->getHeight(),
					'short_name' => $file->getShortName()
				];
					
			} 
		}		
		return $jsonArray;
	}
	
	/**
     * @return string
     */
	public function imageinsert($image_data){
		
		$filename = $image_data['filename'];
        $filename = $this->_cmsWysiwygImages->idDecode($filename);
		
		$image = $this->_cmsWysiwygImages->getImageHtmlDeclaration($filename, $image_data['as_is']);
		
		return $image;
	}
	
		    
}