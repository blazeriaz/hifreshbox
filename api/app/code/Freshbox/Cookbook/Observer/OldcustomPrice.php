<?php
    
namespace Freshbox\Cookbook\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\RequestInterface;

class OldcustomPrice implements ObserverInterface
{
	public function execute(\Magento\Framework\Event\Observer $observer) {
		$item = $observer->getEvent()->getData();
		$rr = json_encode($item);
		$writer = new \Zend\Log\Writer\Stream(BP . '/var/log/test.log');
$logger = new \Zend\Log\Logger();
$logger->addWriter($writer);
$logger->info($rr);

		/*$item = $observer->getEvent()->getData();         
		$item = ( $item->getParentItem() ? $item->getParentItem() : $item );
		$price = 100; //set your price here
		$item->setCustomPrice($price);
		$item->setOriginalCustomPrice($price);
		$item->getProduct()->setIsSuperMode(true);*/
	}

}