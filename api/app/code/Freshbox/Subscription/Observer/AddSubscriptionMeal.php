<?php
    
namespace Freshbox\Subscription\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

class AddSubscriptionMeal implements ObserverInterface
{
	
	private $orderRepository;
	private $searchCriteriaBuilder;

	public function __construct(
		 \Magento\Sales\Model\OrderRepository $orderRepository,
		 \Freshbox\Wallet\Model\WalletFactory  $walletFactory,
		 \Freshbox\Subscription\Model\MainFactory  $mainFactory,
		 \Magento\Framework\Stdlib\DateTime\TimezoneInterface $timezone,
		 \Magento\Framework\Mail\Template\TransportBuilder $transportBuilder,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
		 \Freshbox\Menus\Model\ResourceModel\Menu\CollectionFactory $menuCollectionFactory,
        \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder
   
	) {
    $this->orderRepository = $orderRepository;
	$this->searchCriteriaBuilder = $searchCriteriaBuilder;
	$this->mainFactory        = $mainFactory;
	 $this->walletFactory        = $walletFactory;
	$this->timezone = $timezone;
	$this->storeManager = $storeManager;
		$this->_transportBuilder = $transportBuilder;
	$this->menuCollectionFactory    = $menuCollectionFactory;
	}
	public function execute(\Magento\Framework\Event\Observer $observer) {
		
			
		$order = $observer->getEvent()->getOrder();
		 $newState = $order->getData('state');
		 
		
		$subscription = 0;
		$is_gift = 0;
		 foreach($order->getAllItems() as $item){
			if($item->getSku() == 'freshbox-subscription'){
				$subscription = 1;
			}
			if($item->getSku() == 'freshbox-gift'){
				$is_gift = 1;
				
				
				$itemdata = $item->getData();
				
				$options = $itemdata['product_options']['options'];
				
				foreach($options as $opts){
					$lower_key = strtolower($opts['label']);
					$key_value = str_replace(" ","_",$lower_key);
					$gift_data[$key_value] = $opts['value'];
	
				}
				
				/*$writer = new \Zend\Log\Writer\Stream(BP . '/var/log/test.log');
				$logger = new \Zend\Log\Logger();
				$logger->addWriter($writer);
				$logger->info(json_encode($gift_data));
				$logger->info('********H****E*****L*****L*******O*****');*/
				
			}
			
		 }
		 
		 if( $newState == 'processing' && $is_gift == 1){
			
			$code = 'GI'.time();
			$model = $this->walletFactory->create();
			$model->setData('customer_id',$order->getCustomerId());
			$model->setData('order_id', $order->getIncrementId());
            $model->setData('is_redeemed', 0);
            $model->setData('redeemed_user', 0);
			$model->setData('redeemed_code', $code);
			$model->setData('from_name', $gift_data['from_name']);
			$model->setData('to_first_name', $gift_data['recipient_first_name']);
			$model->setData('to_last_name', $gift_data['recipient_last_name']);
			$model->setData('to_email', $gift_data['recipient_email']);
			$model->setData('message', $gift_data['message']);
			$model->setData('amount', $gift_data['amount']);
			$model->save();
			
			/* email to Recipent */
			$store = $this->storeManager->getStore()->getId();
			  $sender = [
            'name'  => $gift_data['from_name'],
            'email' => $order->getCustomerEmail(),
            ];
			
			$data_val = [
				'store'   => $this->storeManager->getStore(),
				'subject'         => 'You have Received a Gift Card from'.$gift_data['from_name'],
				'message'       => $gift_data['message'],
				'from_name'		=> $gift_data['from_name'],
				'from_email'	=> $order->getCustomerEmail(),
				'to_fname'	=> $gift_data['recipient_first_name'],
				'to_lname'	=> $gift_data['recipient_last_name'],
				'to_email'	=>$gift_data['recipient_email'],
				'amount'=> $gift_data['amount'],
				'code'=> $code
			];
			$postObject = new \Magento\Framework\DataObject();
			$postObject->setData($data_val);
			$transport = $this->_transportBuilder->setTemplateIdentifier(7)
            ->setTemplateOptions(['area' => \Magento\Framework\App\Area::AREA_FRONTEND, 'store' => $store])
            ->setTemplateVars(['data'=>$postObject])
            ->setFrom($sender)
			->addTo($gift_data['recipient_email'])
            ->getTransport();
           $transport->sendMessage();
			 
		 }
		 
		if($subscription){
			
			$date = $this->timezone->date();
			$week = $date->format("W");
			$day_no = $date->format("N");
			$year = $date->format("Y");
			if($day_no > 5){
				$week_no = $week+1;
			}else{
				$week_no = $week;
			}
			
			$collection = $this->menuCollectionFactory->create();
			
			$collection->addFieldToFilter('week_no', $week_no);
			$collection->addFieldToFilter('week_year', $year);
			$product_sku = '';
			if ($collection->getSize() > 0) {
			
				foreach($collection as $weekCollection){
					$product_sku .= $weekCollection->getRecipeSku().',';
				}
			}
			$week_sku = rtrim($product_sku,',');
			
			$orderincrementId = $order->getIncrementId();	
			$customerid = $order->getCustomerId();	
			$model = $this->mainFactory->create();
			$model->setData('order_id',$orderincrementId);
			$model->setData('user_id', $customerid);
			$model->setData('is_active', 1);
			$model->setData('sort_order', 1);
			$model->setData('meals_in_weeks', $week_sku);
			$model->setData('week_no', $week_no);
			$model->setData('year', $year);
			$model->save();
		}
		
		
		
	}

}