<?php
namespace Freshbox\Newsletter\Model;



use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Api\DataObjectHelper;
use Magento\Framework\Reflection\DataObjectProcessor;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Api\SearchResultsInterfaceFactory;

/**
 * @api
 */
class SubscriberRepository implements \Freshbox\Newsletter\Api\SubscriberRepositoryInterface
{
    /**
     * @var \Freshbox\Ingredients\Model\ResourceModel\Ingredient
     */
    protected $resource;

    /**
     * @var \Freshbox\Ingredients\Model\IngredientFactory
     */
    protected $ingredientFactory;

    /**
     * @var \Freshbox\Ingredients\Model\ResourceModel\Ingredient\CollectionFactory
     */
    protected $ingredientCollectionFactory;

    /**
     * @var \Magento\Framework\Api\SearchResultsInterface
     */
    protected $searchResultsFactory;

    /**
     * @var \Magento\Framework\Api\DataObjectHelper
     */
    protected $dataObjectHelper;

    /**
     * @var \Magento\Framework\Reflection\DataObjectProcessor
     */
    protected $dataObjectProcessor;

    /**
     * @var \Freshbox\Ingredients\Api\Data\IngredientInterfaceFactory
     */
    protected $dataIngredientFactory;
	
	protected $subscriberFactory;
	
	protected $addressFactory;

    /**
     * @param ResourceModel\Ingredient $resource;
     * @param IngredientFactory $ingredientFactory
     * @param ResourceModel\Ingredient\CollectionFactory $ingredientCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Ingredients\Api\Data\IngredientInterfaceFactory $dataIngredientFactory
     */
    public function __construct(
        \Freshbox\Ingredients\Model\ResourceModel\Ingredient $resource,
		\Freshbox\Ingredients\Model\IngredientFactory  $ingredientFactory,
        \Freshbox\Ingredients\Model\ResourceModel\Ingredient\CollectionFactory $ingredientCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Ingredients\Api\Data\IngredientInterfaceFactory $dataIngredientFactory,
		\Magento\Newsletter\Model\ResourceModel\Subscriber\CollectionFactory $subcriberCollectionFactory,
		\Magento\Newsletter\Model\SubscriberFactory $subscriberFactory,
		\Magento\Customer\Model\AddressFactory $addressFactory
    )
    {
        $this->resource = $resource;
        $this->ingredientFactory        = $ingredientFactory;
        $this->ingredientCollectionFactory    = $ingredientCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataIngredientFactory = $dataIngredientFactory;
		$this->_subcriberCollectionFactory = $subcriberCollectionFactory;
		 $this->subscriberFactory= $subscriberFactory;
		 $this->addressFactory = $addressFactory;
    }
    
    

    

    /**
     * @api
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        $searchResults = $this->searchResultsFactory; //->create();
		
		
        $searchResults->setSearchCriteria($searchCriteria);
		
		$collection = $this->_subcriberCollectionFactory->create();
		
		foreach ($searchCriteria->getFilterGroups() as $filterGroup) {
            $fields = [];
            $conditions = [];
            foreach ($filterGroup->getFilters() as $filter) {
                $condition = $filter->getConditionType() ? $filter->getConditionType() : 'eq';
                $fields[] = $filter->getField();
                $conditions[] = [$condition => $filter->getValue()];
            }
            if ($fields) {
                $collection->addFieldToFilter($fields, $conditions);
            }
        }

        $searchResults->setTotalCount($collection->getSize());
		//return $searchCriteria;
        $sortOrders = $searchCriteria->getSortOrders();
		
		if ($sortOrders) {
            /** @var SortOrder $sortOrder */
            foreach ($sortOrders as $sortOrder) {
				
                $collection->addOrder(
                    $sortOrder->getField(),
                    ($sortOrder->getDirection() == 'ASC') ? 'ASC' : 'DESC'
                );
            }
        }
		//$collection->addOrder('review_id','DESC');
        $collection->setCurPage($searchCriteria->getCurrentPage());
        $collection->setPageSize($searchCriteria->getPageSize());
		
		$subscriptionArray = [];                                    
        foreach ($collection as $newsletterCollection) {
			
			 $data = [
                "subscriber_id"       => $newsletterCollection->getSubscriberId(),
                "store_id"      => $newsletterCollection->getStoreId(),
                "change_status_at"       => $newsletterCollection->getChangeStatusAt(),
                "customer_id"       => $newsletterCollection->getCustomerId(),
                "subscriber_email"       => $newsletterCollection->getSubscriberEmail(),
                "subscriber_status"       => $newsletterCollection->getSubscriberStatus(),
                "subscriber_confirm_code"       => $newsletterCollection->getSubscriberConfirmCode(),
                
            ];
            $subscriptionArray[] = $data;
		}
		 $this->searchResultsFactory->setItems($subscriptionArray);
        return $searchResults; 
		
		
    }
	
	  /**
     * @return mixed
     */
	
	public function save($email){
		try{
		 if($this->isValidEmail($email)) {
			 
			  // MailChimp API credentials
        $apiKey = '12cd35463ed865a7092821655a2f8e61-us17';
        $listID = 'ccb910a666';
        
        // MailChimp API URL
        $memberID = md5(strtolower($email));
        $dataCenter = substr($apiKey,strpos($apiKey,'-')+1);
        $url = 'https://' . $dataCenter . '.api.mailchimp.com/3.0/lists/' . $listID . '/members/' . $memberID;
        
        // member information
        $json = json_encode([
            'email_address' => $email,
            'status'        => 'subscribed'
            
        ]);
        
        // send a HTTP POST request with curl
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_USERPWD, 'user:' . $apiKey);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
		
		if ($httpCode == 200) {
           $msg = 'success';
        } else {
            switch ($httpCode) {
                case 214:
                    $msg = 'You are already subscribed.';
                    break;
                default:
                    $msg = 'Some problem occurred, please try again.';
                    break;
            }
			 
		}
		return $msg;
			 
			/* $checkSubscriber = $this->subscriberFactory->create()->loadByEmail($email);
			 
			
			 if($checkSubscriber->isSubscribed()){
				 return 'Already Subscribed';
			 }else{
				$subscription = $this->subscriberFactory->create()->subscribe($email);
			 }*/
		 }	
		}catch(Exception $e){
			return $e->getMessage();
		}
		
	}
	
	/**
     * Remove all illegal characters from email and validates it.
     *
     * @param string $email
     * @return bool
     */
    protected function isValidEmail(string $email)
    {
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
 
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return false;
        }
 
        return true;
    }
	/**
     * @return mixed
     */
	public function newaddress($newaddress){
		$address = $this->addressFactory->create();
		 try{
			 
		$address->setCustomerId($newaddress['customer_id']);
			
		 $address->setFirstname($newaddress['firstname']);
			 
		 $address->setLastname($newaddress['lastname']);
			 
		 $address->setCountryId($newaddress['country_id']);
			
			if($newaddress['region_id']){
			$address->setRegionId($newaddress['region_id']);
			}
			if($newaddress['post_code']){
			$address->setPostcode($newaddress['post_code']);
			}
			if($newaddress['city']){
			$address->setCity($newaddress['city']);
			}
			if($newaddress['telephone']){
			$address->setTelephone($newaddress['telephone']);
			}
			if($newaddress['fax']){
			$address->setFax($newaddress['fax']);
			}
			if($newaddress['company']){
			$address->setCompany($newaddress['company']);
			}
			if($newaddress['street']){
			$address->setStreet($newaddress['street']);
			}
			if($newaddress['is_default_billing']){
			$address->setIsDefaultBilling($newaddress['is_default_billing']);
			}else{
				$address->setIsDefaultBilling(0);
			}
			if($newaddress['is_default_shipping']){
				$address->setIsDefaultShipping($newaddress['is_default_shipping']);
			}else{
				$address->setIsDefaultShipping(0);
			}
			
			$address->setSaveInAddressBook('1');
			 
			$address->save();
			
		 }catch (Exception $e) {
				return $e->getMessage();
			}
		return $address;
	}
	
	
}