<?php
    
namespace Freshbox\Cookbook\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\RequestInterface;

class NewcustomPrice implements ObserverInterface
{
	
	public function __construct(
		\Magento\Framework\Registry $registry
	 ){
		 $this->_registry = $registry;
	 }
	public function execute(\Magento\Framework\Event\Observer $observer) {
		
		$item = $observer->getEvent()->getData('quote_item');    
		
		
		$item = ( $item->getParentItem() ? $item->getParentItem() : $item );
		$price = $this->_registry->registry('custom_price'); //set your price here
		//$price = 101;
		$item->setCustomPrice($price);
		$item->setOriginalCustomPrice($price);
		$item->getProduct()->setIsSuperMode(true);

	}

}