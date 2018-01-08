<?php
    
namespace Freshbox\Cookbook\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\RequestInterface;

class CheckoutcartSave implements ObserverInterface
{
	public function execute(\Magento\Framework\Event\Observer $observer) {
		
		$writer = new \Zend\Log\Writer\Stream(BP . '/var/log/test.log');
$logger = new \Zend\Log\Logger();
$logger->addWriter($writer);
$logger->info('CheckoutcartSave');

		/*$item = $observer->getEvent()->getData('quote_item');         
		$item = ( $item->getParentItem() ? $item->getParentItem() : $item );
		$price = 100; //set your price here
		$item->setCustomPrice($price);
		$item->setOriginalCustomPrice($price);
		$item->getProduct()->setIsSuperMode(true);*/
	}

}