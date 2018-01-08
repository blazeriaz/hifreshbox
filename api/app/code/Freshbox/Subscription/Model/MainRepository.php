<?php
namespace Freshbox\Subscription\Model;



use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Api\DataObjectHelper;
use Magento\Framework\Reflection\DataObjectProcessor;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Api\SearchResultsInterfaceFactory;

use Magento\Vault\Api\PaymentTokenManagementInterface;
use Magento\Framework\Encryption\EncryptorInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Braintree\Gateway\Command\GetPaymentNonceCommand;
use Magento\Vault\Api\PaymentTokenRepositoryInterface;
/**
 * @api
 */
class MainRepository implements \Freshbox\Subscription\Api\MainRepositoryInterface
{
    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Main
     */
    protected $resource;
	
	/**
     * @var PaymentTokenRepositoryInterface
     */
    private $tokenRepository;
	
	/**
     * @var GetPaymentNonceCommand
     */
    private $command;

    /**
     * @var \Freshbox\Subscription\Model\MainFactory
     */
    protected $mainFactory;

    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Faq\CollectionFactory
     */
    protected $mainCollectionFactory;

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
     * @var \Freshbox\Subscription\Api\Data\MainInterfaceFactory
     */
    protected $dataMainFactory;
	
	protected $_orderCollectionFactory;
	
    /**
     * @var EncryptorInterface
     */
    protected $encryptor;
	
	protected $_reviewFactory;
	
	/**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
	 * @param PaymentTokenRepositoryInterface $tokenRepository
     * @param ResourceModel\Main $resource;
     * @param MainFactory $mainFactory
     * @param ResourceModel\Main\CollectionFactory $mainCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Subscription\Api\Data\MainInterfaceFactory $dataMainFactory
	 * 
	 * @param EncryptorInterface $encryptor
     */
    public function __construct(
		 PaymentTokenRepositoryInterface $tokenRepository,
        \Freshbox\Subscription\Model\ResourceModel\Main $resource,
		\Freshbox\Subscription\Model\ResourceModel\Pause\CollectionFactory $pauseCollectionFactory,
		\Magento\Catalog\Model\ProductFactory $productFactory,
		\Freshbox\Subscription\Model\MainFactory  $mainFactory,
        \Freshbox\Subscription\Model\ResourceModel\Main\CollectionFactory $mainCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
		\Magento\Framework\Stdlib\DateTime\TimezoneInterface $timezone,
		\Freshbox\Subscription\Model\ResourceModel\Recurring\CollectionFactory $recurringCollectionFactory,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Subscription\Api\Data\MainInterfaceFactory $dataMainFactory,
		\Magento\Vault\Api\PaymentTokenManagementInterface $PaymentTokenManagement,
        \Freshbox\Subscription\Model\ResourceModel\Primarycard\CollectionFactory $primarycardCollectionFactory,
		\Magento\Review\Model\ReviewFactory $reviewFactory,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
		EncryptorInterface $encryptor,
		GetPaymentNonceCommand $command,
		\Magento\Sales\Model\ResourceModel\Order\CollectionFactory $orderCollectionFactory
    )
    {
        $this->resource = $resource;
        $this->mainFactory        = $mainFactory;
		$this->pauseCollectionFactory    = $pauseCollectionFactory;
		$this->productFactory = $productFactory;
        $this->mainCollectionFactory    = $mainCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
		$this->recurringCollectionFactory    = $recurringCollectionFactory;
        $this->dataMainFactory = $dataMainFactory;
		$this->timezone = $timezone;
		$this->paymentTokenManagement = $PaymentTokenManagement;
        $this->encryptor = $encryptor;
		$this->command = $command;
		 $this->_reviewFactory = $reviewFactory;
		 $this->tokenRepository = $tokenRepository;
		 $this->storeManager = $storeManager;
          $this->primarycardCollectionFactory    = $primarycardCollectionFactory;
		$this->_orderCollectionFactory = $orderCollectionFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Subscription\Api\Data\MainInterface $subscription
     * @param int $customerId
     * @return \Freshbox\Subscription\Api\Data\MainInterface 
     */
    public function save(\Freshbox\Subscription\Api\Data\MainInterface $subscription,$customerId)
    {
        try
        {
			$subscription['user_id'] = $customerId;
            $this->resource->save($subscription);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $subscription;
    }

    /**
     * @api
     * @param int $subscriptionId
     * @return \Freshbox\Subscription\Api\Data\MainInterface
     */
    public function getById($subscriptionId)
    {
        $main_subscription = $this->mainFactory->create();

        $this->resource->load($main_subscription, $subscriptionId);

        if (!$main_subscription->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $subscriptionId));
        }
        return $main_subscription;        
    }       

    /**
     * @api
     * @param \Freshbox\Subscription\Api\Data\Main $subscription
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Subscription\Api\Data\MainInterface $subscription)
    {
        try {
            $this->resource->delete($subscription);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__($exception->getMessage()));
        }
        return true;    
    }    

    /**
     * @api
     * @param int $id
     * return bool true on success
     */
    public function deleteById($id)
    {
        return $this->delete($this->getById($id));
    }    

    /**
     * @api
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        //echo get_class($this->searchResultsFactory). "\n\n";
        $searchResults = $this->searchResultsFactory; //->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->mainCollectionFactory->create();

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
        $sortOrders = $searchCriteria->getSortOrders();
		
		//$collection->addOrder('creation_time','DESC');
        if ($sortOrders) {
          
            foreach ($sortOrders as $sortOrder) {
                $collection->addOrder(
                    $sortOrder->getField(),
                    ($sortOrder->getDirection() == 'ASC') ? 'ASC' : 'DESC'
                );
            }
        }
        $collection->setCurPage($searchCriteria->getCurrentPage());
        $collection->setPageSize($searchCriteria->getPageSize());
        $main_subscription = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $mainData = $this->dataMainFactory->create();
            $this->dataObjectHelper->populateWithArray($faqData, $slideModel->getData(), '\Freshbox\Subscription\Api\Data\MainInterface');
            $main_subscription[] = $this->dataObjectProcessor->buildOutputDataArray($mainData, '\Freshbox\Subscription\Api\Data\MainInterface');
        }

        $this->searchResultsFactory->setItems($main_subscription);
        return $this->searchResultsFactory;

    }
	
	/**
     * @api
     * @param int $customerId
     * @return mixed
     */
	
	public function getMysubscription($customerId){
		
		
		$user_meal_data = $this->mainCollectionFactory->create();
				
		$user_meal_data->addFieldToFilter('user_id', $customerId);
		$user_meal_data->addFieldToFilter('is_active', 1);
		
		$count = count($user_meal_data);
		return array('subscription_count'=>$count,
				'subscription_details'=>$user_meal_data->getData());
		
	}
	
	/**
     * @api
     * @param int $customerId
     * @param int $subscriptionId
     * @return mixed
     */
	public function unsubscribe($customerId,$subscriptionId){
		
		$main_subscription = $this->mainFactory->create()->load($subscriptionId);
		
		$main_subscription->setData('is_active',0);
		$main_subscription->save();
		
		return 'success';
		
	}
	
	/**
     * @api
     * @param int $customerId
     * @param int $subscriptionId
     * @return mixed
     */
	public function viewsubscription($customerId,$subscriptionId){
		
		$main_subscription = $this->mainFactory->create()->load($subscriptionId);
		
		$subscribed_on = $main_subscription->getCreationTime();
		$subscribed_orderid = $main_subscription->getOrderId();
		$subscribed_weekno = $main_subscription->getWeekNo();
		$subscribed_year = $main_subscription->getYear();
		
		$date = $this->timezone->date();
		
		$current_week_no = $date->format("W");
		
		$date->modify('next friday');
		
		$next_order_date = $date->format('Y-m-d h:i:s');

        $blocked_data = $this->get_blocked_user_dates($customerId);

        if($blocked_data){
            $blocked_start_date = $blocked_data[0]['start_date'];
             $blocked_end_date = $blocked_data[0]['end_date'];
            $blocked_id = $blocked_data[0]['pause_id'];
        }else{
            $blocked_start_date = '';
            $blocked_end_date = '';
            $blocked_id = '';
        }
		
		//$nxt_ord_date = $this->getnextorderdate($next_order_date,$customerId);
		
		$checkif_today_blocked = $this->check_is_current_week_blocked($customerId);
		
		$next_delivery_date = $this->timezone->date($next_order_date);
		
		$next_order_week_new = $next_delivery_date->format('W');
		$next_order_year_new = $next_delivery_date->format("Y");
		
		$next_delivery_date->modify('next tuesday');
		
		$nxt_dlvry_date = $next_delivery_date->format('Y-m-d h:i:s');
		
		$subscription_details[] = array(
								'next_order_date'=>$next_order_date,
								'next_delivery_date'=>$nxt_dlvry_date,
								'subscribed_on' =>$subscribed_on,
								'subscribed_weekno'=>$subscribed_weekno,
								'subscribed_year'=>$subscribed_year,
								'current_week_no'=> $current_week_no,
								'next_order_weekno' =>$next_order_week_new,
								'next_order_year' =>$next_order_year_new,
                                'is_current_week_blocked'=>$checkif_today_blocked,
                                'blocked_week_start'=>$blocked_start_date,
                                'blocked_week_end'=>$blocked_end_date,
                                'paused_id'=>$blocked_id,
								'resu' => $checkif_today_blocked
									);
		
		
		return $subscription_details;
		
	}

    public function get_blocked_user_dates($customerId){
        $pause_query = $this->pauseCollectionFactory->create();
		$pause_query->addFieldToFilter('user_id', $customerId);
        $pause_query->setOrder('pause_id','desc');
        return $pause_query->getData();
    }
	
	public function check_is_current_week_blocked($customerId){
		$current_date = $this->timezone->date();
		$current_date_new = $current_date->format('Y-m-d');

        $date_text = strtolower($current_date->format('l'));

        if($date_text == 'friday'){
            $mydate = $current_date_new;
        }else{
          $friday_date =  $current_date->modify('next friday');
          $mydate =  $friday_date->format('Y-m-d');
        }

      // return $mydate;

        $pause_query = $this->pauseCollectionFactory->create();
		$pause_query->addFieldToFilter('user_id', $customerId);
      

       $pause_query->addFieldToFilter('start_date', ['lteq' => $mydate]);
       $pause_query->addFieldToFilter('end_date', ['gteq' => $mydate]);
      // return $pause_query->getSelect();
        return $cnt_detail = $pause_query->getSize();

	}
	
	public function getnextorderdate($next_order_date,$customerId){
		
		
		
		$next_delivery_date = $this->timezone->date($next_order_date);
		$next_order_week = $next_delivery_date->format("W");
		$next_order_year = $next_delivery_date->format("Y");
		
		$pause_query = $this->pauseCollectionFactory->create();
		$pause_query->addFieldToFilter('user_id', $customerId);
		$pause_query->addFieldToFilter('week_no', $next_order_week);
		$pause_query->addFieldToFilter('year', $next_order_year);
		$cnt_detail = $pause_query->getSize();
		
		if($cnt_detail > 0){
			
			$next_delivery_date->modify('next friday');
			
			$next_order_date = $next_delivery_date->format('Y-m-d h:i:s');
			
			
			return $this->getnextorderdate($next_order_date,$customerId); 
			
		}else if($cnt_detail == 0){
			
			return $next_order_date = $next_delivery_date->format('Y-m-d h:i:s');
			
		}
			
	}
	
	/**
     * @api
     * @param int $customerId
	 * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return mixed
     */
	public function getsubscriptionorders($customerId,\Magento\Framework\Api\SearchCriteriaInterface $criteria){
		
		if($criteria->getPageSize()){
			$page_size = $criteria->getPageSize();
		}else{
			$page_size = 5;
		}
		
		if($criteria->getCurrentPage()){
			$current_page = $criteria->getCurrentPage();
		}else{
			$current_page = 1;
		}
		
		
		$collection = $this->recurringCollectionFactory->create();
		
		$collection->getSelect()->joinLeft(
				['order'=>$collection->getTable('sales_order')],
				'main_table.order_id = order.increment_id',
				['status'=>'order.status','grand_total','base_currency_code']
		);
		
		$collection->addFieldToFilter('main_table.user_id', $customerId);
		$collection->setOrder('main_table.recuring_id','DESC');
        $collection->setPageSize($page_size);
        $collection->setCurPage($current_page);
		
		$total_record = $collection->getSize();
		$order_items = $collection->getData();
		$recurring_items = [];
		$i =0;
		foreach($order_items as $items){
			$product_sku_arr = explode(",",$items['meals_in_weeks']);
			$product_arr = [];
			if(count($product_sku_arr)>0){
				foreach($product_sku_arr as $product_sku){
					$product = $this->productFactory->create();
					$product_res = $product->loadByAttribute('sku', $product_sku);
					if($product_res){
						$recipe_detail = $product_res->getData();
						$this->_reviewFactory->create()->getEntitySummary($product_res, $this->storeManager->getStore()->getId());
					    $recipe_detail['rating_summary'] = $product_res->getRatingSummary()->getRatingSummary();
						
						$product_arr[] = $recipe_detail; 
					}
				}
			}
			$recurring_items[$i]= $items;
			$recurring_items[$i]['product_list']= $product_arr;
			$i++;
		}
		$result['items'] = $recurring_items;
		$result[]['page_size'] = $page_size;
		$result[]['current_page'] = $current_page;
		$result[]['total_record'] = $total_record;
		return $result;
		
	}
	
	/**
     * @api
     * @param int $customerId
	 * 
     * @return mixed
     */
	public function listcreditcard($customerId){
		 $cardList = $this->paymentTokenManagement->getVisibleAvailableTokens($customerId);

            $primary_card = [];
            $primary_card_query = $this->primarycardCollectionFactory->create();
			$primary_card_query->addFieldToFilter('user_id', $customerId);
            $cnt_coll = $primary_card_query->count();
            if($cnt_coll > 0){
                $primary_card = $primary_card_query->getData();
            }
		 $credit_cards = [];
         $k=0;
		foreach($cardList as $list_card){
			$credit_card_detail = $list_card->getData();
            $credit_cards[$k] = $credit_card_detail;
            if($cnt_coll > 0){
                if($credit_card_detail['entity_id'] == $primary_card[0]['card_id']){
                $credit_cards[$k]['is_default'] = 1;
              }else{
                 $credit_cards[$k]['is_default'] = 0; 
            }
            }
            $k++;
		}
		return $credit_cards;
	}
	
	/**
     * @api
     * @param int $customerId
	 * @param mixed $public_hash
     * @return mixed
     */
	public function getpaymentnonce($customerId,$public_hash){
		
		  $publicHash = $public_hash;
            $customerId = $customerId;
			try {
           $result = $this->command->execute(['public_hash' => $publicHash, 'customer_id' => $customerId])->get();
			return $result['paymentMethodNonce'];
			} catch (\Exception $e) {
            
            return $e->getMessage();
			
        }
	}
	
	/**
     * @api
     * @param int $customerId
	 * @param mixed $public_hash
     * @return mixed
     */
	public function deletecard($customerId,$public_hash){
		
		$publicHash = $public_hash;
        $customerId = $customerId;
		if ($publicHash === null) {
            return 'Error Public hash is missing';
        }	
		$paymentToken = $this->paymentTokenManagement->getByPublicHash($publicHash,$customerId);
		
		
		//return $paymentToken->getData();
		if ($paymentToken === null) {
            return 'Wrong Token';
        }
		
		try {
			$res = $this->tokenRepository->delete($paymentToken);
		} catch (\Exception $e) {
            return $e->getMessage();
        }
		return 'success';
	}
	
	/**
     * @api
     * @param int $customerId
	 * 
     * @return mixed
     */
	public function getcustomertranscation($customerId){
		
		$collection = $this->_orderCollectionFactory->create();
		$collection->getSelect()->joinRight(
				['transcation'=>$collection->getTable('sales_payment_transaction')],
				'main_table.entity_id = transcation.order_id',
				['payment_id','transaction_id','is_closed']
		)->join(
				['payment'=>$collection->getTable('sales_order_payment')],
				'main_table.entity_id = payment.parent_id',
				['base_amount_paid','amount_refunded','amount_canceled','base_amount_authorized','base_amount_paid_online','amount_ordered']
		);
		$collection->addFieldToFilter('main_table.customer_id', $customerId);
		return $collection->getData();
		//return $collection->getSelect();
		return $customerId;
	}
	
	
	
	
}