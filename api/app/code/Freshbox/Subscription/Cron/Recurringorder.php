<?php
namespace Freshbox\Subscription\Cron;
use \Psr\Log\LoggerInterface;
use Magento\Vault\Api\PaymentTokenManagementInterface;
use Magento\Braintree\Gateway\Command\GetPaymentNonceCommand;

class Recurringorder {
    protected $logger;
	
	/**
     * @var GetPaymentNonceCommand
     */
    private $command;
	
	/**
     * @var \Freshbox\Subscription\Model\ResourceModel\Faq\CollectionFactory
     */
    protected $mainCollectionFactory;

    public function __construct(LoggerInterface $logger,
		\Freshbox\Subscription\Model\ResourceModel\Main\CollectionFactory $mainCollectionFactory,
		\Magento\Catalog\Model\ProductFactory $productFactory,
		\Freshbox\Meals\Model\PreferenceoptionFactory  $preferenceoptionFactory,
		\Freshbox\Subscription\Model\ResourceModel\Pause\CollectionFactory $pauseCollectionFactory,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Catalog\Model\Product $product,
		 \Magento\Quote\Model\QuoteFactory $quote,
        \Magento\Quote\Model\QuoteManagement $quoteManagement,
        \Magento\Customer\Model\CustomerFactory $customerFactory,
		\Freshbox\Subscription\Model\MainFactory  $mainFactory,
        \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository,
        \Magento\Sales\Model\Service\OrderService $orderService,
		\Magento\Customer\Api\AddressRepositoryInterface $addressrepository,
		\Magento\Quote\Api\CartRepositoryInterface $cartRepositoryInterface,
        \Magento\Quote\Api\CartManagementInterface $cartManagementInterface,
		\Freshbox\Subscription\Model\RecurringFactory  $recurringFactory,
		 \Freshbox\Menus\Model\ResourceModel\Menu\CollectionFactory $menuCollectionFactory,
		\Magento\Framework\Registry $registry,
		\Magento\Framework\Stdlib\DateTime\TimezoneInterface $timezone,
		\Magento\Vault\Api\PaymentTokenManagementInterface $PaymentTokenManagement,
		 \Freshbox\Subscription\Model\ResourceModel\Recurring\CollectionFactory $recurringCollectionFactory,
		 GetPaymentNonceCommand $command,
		\Freshbox\Meals\Model\ResourceModel\Subscribemealpreference\CollectionFactory $subscribemealpreferenceCollectionFactory
		) {
		$this->_storeManager = $storeManager;
        $this->_product = $product;	
		$this->menuCollectionFactory    = $menuCollectionFactory;
		$this->pauseCollectionFactory    = $pauseCollectionFactory;
		$this->quote = $quote;
		$this->addressRepository  = $addressrepository;
        $this->quoteManagement = $quoteManagement;
        $this->customerFactory = $customerFactory;
        $this->customerRepository = $customerRepository;
        $this->orderService = $orderService;
        $this->logger = $logger;
		$this->timezone = $timezone;
		$this->productFactory = $productFactory;
		 $this->mainFactory        = $mainFactory;
		 $this->cartRepositoryInterface = $cartRepositoryInterface;
        $this->cartManagementInterface = $cartManagementInterface;
		$this->mainCollectionFactory    = $mainCollectionFactory;
		 $this->preferenceoptionFactory        = $preferenceoptionFactory;
		 $this->recurringFactory        = $recurringFactory;
        $this->recurringCollectionFactory    = $recurringCollectionFactory;
		$this->paymentTokenManagement = $PaymentTokenManagement;
		$this->command = $command;
		 $this->_registry = $registry;
		$this->subscribemealpreferenceCollectionFactory    = $subscribemealpreferenceCollectionFactory; 
    }

/**
   * Write to system.log
   *
   * @return void
   */

    public function execute() {
		
		
		
		$date = $this->timezone->date();
			$week_no = $date->format("W");
			$day_no = $date->format("N");
			$year = $date->format("Y");
			
		
		$product = $this->productFactory->create();
		$product_res = $product->loadByAttribute('sku', 'freshbox-subscription-recurring');
		$price = $product_res->getPrice();
		
		$collection = $this->mainCollectionFactory->create();
		$collection->addFieldToFilter('is_active', 1);
		$collection->addFieldToFilter('week_no', array('neq' => $week_no));
		$collection->addFieldToFilter('year', $year);
		
		$collection->setOrder('sort_order','asc');
		if ($collection->getSize() > 0) {
			foreach($collection as $recurring_subscription){
				
				
				$sub_user_id = $recurring_subscription->getUserId();
				//if($sub_user_id == 15){
				$sub_main_order_id = $recurring_subscription->getOrderId();
				$sub_id = $recurring_subscription->getSubscriptionId();
				
				/*----------Check if the Subscription Paused----------------------*/
				$today_date_custm = $date->format("Y-m-d");
				$pause_query = $this->pauseCollectionFactory->create();
				$pause_query->addFieldToFilter('user_id', $sub_user_id);
				$pause_query->addFieldToFilter('start_date', ['lteq' => $today_date_custm]);
      			 $pause_query->addFieldToFilter('end_date', ['gteq' => $today_date_custm]);
     
    			 $cnt_detail = $pause_query->getSize();
								
				if($cnt_detail == 0){
				/*--------------------------------*/
				
				$user_meal_data = $this->subscribemealpreferenceCollectionFactory->create();
				
				$user_meal_data->addFieldToFilter('user_id', $sub_user_id);
				$user_preference = [];
				$user_preference = $user_meal_data->getData();
				
				if(count($user_preference) == 1){
					$user_preference_array = [];
					$user_preference_array = json_decode($user_preference[0]['meal_preference_setting']);
					
					$option_price = 0;
					$option_text = '';
					foreach($user_preference_array as $user_preferred){
						$option_id = $user_preferred->option_id;
						$qty = $user_preferred->qty;
						$preferenceopt = $this->preferenceoptionFactory->create();
				
						$preference_opt = $preferenceopt->load($option_id);
				 
						$pref_price = $option_price + floatval($preference_opt->getPrice());
						
						$option_text .= $preference_opt->getTitle().' * '.$qty.',';
						
						$option_price = $pref_price * $qty;
						
					}
					$new_price = $option_price + $price;
					
					$option_text = rtrim($option_text,',');
					
					// creating order programatically
					$store = $this->_storeManager->getStore(1);
					
					$websiteId = $this->_storeManager->getStore()->getWebsiteId();
					
					$cart_id = $this->cartManagementInterface->createEmptyCart();
					$cart = $this->cartRepositoryInterface->get($cart_id);
					$cart->setStore($store);
					
										
					// if you have allready buyer id then you can load customer directly 
					
					$customer = $this->customerRepository->getById($sub_user_id);
					
					$shippingAddressId = $customer->getDefaultShipping();
					
					$shippingAddress = $this->addressRepository->getById($shippingAddressId);
					
					$first_name = $shippingAddress->getFirstname();
					$last_name = $shippingAddress->getLastname();
					$street = $shippingAddress->getStreet();
					$city = $shippingAddress->getCity();
					$country_id = $shippingAddress->getCountryId();
					$region = $shippingAddress->getRegion();
					$postcode = $shippingAddress->getPostcode();
					$telephone = $shippingAddress->getTelephone();
					
					$shipping_address = [
						'firstname'    => $first_name, //address Details
						'lastname'     => $last_name,
						'street' => $street[0],
						'city' => $city,
						'country_id' => $country_id,
						'region' => $region,
						'postcode' => $postcode,
						'telephone' => $telephone,
						'fax' => '',
						'save_in_address_book' => 0
					];
					
					
					 $cart->setCurrency();
					
					//$this->cartRepositoryInterface->save($quote);
					
					 $cart->assignCustomer($customer);
					
					
					
			$this->_registry->unregister('custom_price');
			$this->_registry->register('custom_price', $new_price);
			$product = $this->_product->load($product_res->getId());
					
			$_objectManager = \Magento\Framework\App\ObjectManager::getInstance();
			$customOptions = $_objectManager->get('Magento\Catalog\Model\Product\Option')->getProductOptionCollection($product);
			
			$custom_options = $customOptions->getData();
			
			$week_no_id = $this->customoptionid('Week No',$custom_options);
			$option_text_id = $this->customoptionid('Meal Preference',$custom_options);
			$howmuch_meals_week_id = $this->customoptionid('how much meals week',$custom_options);
			$howmany_people_id = $this->customoptionid('how many people',$custom_options);
			$meal_extra_notes_id = $this->customoptionid('meal extra notes',$custom_options);
					
							
			$params = array (
		   
			'product' => $product_res->getId(),
			'qty' => 1,
			'price' => $new_price
		   
			);
					
					$c_week_no = '1';
					$option_text = $option_text;
					$howmuch_meals_week = $user_preference[0]['howmuch_meals_week'];
					$howmany_people = $user_preference[0]['howmany_people'];
					$meal_extra_notes = $user_preference[0]['meal_extra_notes'];
					$params['options'] = array($week_no_id=>$c_week_no,$option_text_id=>$option_text,$howmuch_meals_week_id=>$howmuch_meals_week,$howmany_people_id=>$howmany_people,$meal_extra_notes_id=>$meal_extra_notes);	
					
					$objParam = new \Magento\Framework\DataObject();
			
					$objParam->setData($params);
					$cart->addProduct($product, $objParam);
					
					$cart->getBillingAddress()->addData($shipping_address);
					
					$cart->getShippingAddress()->addData($shipping_address);
					
					$shippingAddress = $cart->getShippingAddress();
					
					$shippingAddress->setCollectShippingRates(true)
                        ->collectShippingRates()
                        ->setShippingMethod('freeshipping_freeshipping'); //shipping method
					
					$cardList = $this->paymentTokenManagement->getVisibleAvailableTokens($sub_user_id);
					$credit_cards = [];
					foreach($cardList as $list_card){
						$credit_cards[] = $list_card->getData();
					}
					if(count($credit_cards) > 0){
						$cart->setPaymentMethod('braintree_cc_vault'); //payment method
					}else{
						$cart->setPaymentMethod('cashondelivery');
					}
							
					
					$cart->setInventoryProcessed(false); //not effetc inventory
					
					/*--------------------------------------*/
					// Getting  Customer _credit card 
					
					if(count($credit_cards)>0){
						
					$public_hash = $credit_cards[0]['public_hash'];
					
					$result = $this->command->execute(['public_hash' => $public_hash, 'customer_id' => $sub_user_id])->get();
					$payment_method_nonce = $result['paymentMethodNonce'];
					/*-----------------------------------------*/
					
					$cart->getPayment()->importData([
									'method' => 'braintree_cc_vault',
									'additional_data'=>[
										"payment_method_nonce"=>$payment_method_nonce, 
										"public_hash"=>$public_hash,
										"is_active_payment_token_enabler"=>true
										]
									]);
					
					
					}else{
						$cart->getPayment()->importData([
									'method' => 'cashondelivery']);
					}
 
					// Collect Totals & Save Quote
					$cart->collectTotals()->save();
					
					$cart->save(); //Now Save quote and your quote is ready
					
 
					// Create Order From Quote
					 $cart = $this->cartRepositoryInterface->get($cart->getId());
					 
					$order_id = $this->cartManagementInterface->placeOrder($cart->getId());
					//$objectManager = \Magento\Framework\App\ObjectManager::getInstance();
					$order = $_objectManager->create('Magento\Sales\Model\Order')->load($order_id);
					$order->getIncrementId();
					
					
					$mcollection = $this->menuCollectionFactory->create();
			
					$mcollection->addFieldToFilter('week_no', $week_no);
					$mcollection->addFieldToFilter('week_year', $year);
					$product_sku = '';
					if ($mcollection->getSize() > 0) {
					
						foreach($mcollection as $weekCollection){
							$product_sku .= $weekCollection->getRecipeSku().',';
						}
					}
					$week_sku = rtrim($product_sku,',');
					
					$model = $this->recurringFactory->create();
					$model->setData('order_id',$order->getIncrementId());
					$model->setData('parent_order_id', $sub_id);
					$model->setData('user_id', $sub_user_id);
					$model->setData('is_active', 1);
					$model->setData('meals_in_weeks', $week_sku);
					$model->setData('week_no', $week_no);
					$model->setData('year', $year);
					$model->setData('sort_order', 1);
					$model->save();
					
					
					
				}
				
				$cron_date = $date->format("Y-m-d h:i:s");
				
				$main_subscription = $this->mainFactory->create()->load($sub_id);
		
				$main_subscription->setData('last_cron_run',$cron_date);
				$main_subscription->save();
			}
			 $this->logger->info('Recurring Order');
			//}
		}
		}
       
    }
	
	public function customoptionid($title,$options){
		
		foreach($options as $opt){
			if($opt['title'] == $title){
				return $opt['option_id'];
			}
		}
		return false;
	}

}