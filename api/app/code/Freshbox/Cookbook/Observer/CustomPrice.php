<?php
    
namespace Freshbox\Cookbook\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\RequestInterface;

class CustomPrice implements ObserverInterface
{
	public function execute(\Magento\Framework\Event\Observer $observer) {
		//$rr = json_encode($observer);
		$writer = new \Zend\Log\Writer\Stream(BP . '/var/log/test.log');
$logger = new \Zend\Log\Logger();
$logger->addWriter($writer);
$logger->info('Riazzzz');

		//$item = $observer->getEvent()->getData('quote_item');         
		 /*if($item->getParentItem()){
			$item = $item->getParentItem();
		 }else{
			$item = $item;
		 }			
		$price = 100; //set your price here
		$item->setCustomPrice($price);
		$item->setOriginalCustomPrice($price);
		$item->getProduct()->setIsSuperMode(true);*/
	}

}