<?php

namespace Sivajik34\CustomFee\Model\Invoice\Total;

use Magento\Sales\Model\Order\Invoice\Total\AbstractTotal;

class Fee extends AbstractTotal
{
    /**
     * @param \Magento\Sales\Model\Order\Invoice $invoice
     * @return $this
     */
    public function collect(\Magento\Sales\Model\Order\Invoice $invoice)
    {
		/*$writer = new \Zend\Log\Writer\Stream(BP . '/var/log/test.log');
		$logger = new \Zend\Log\Logger();
		$logger->addWriter($writer);
		
		
		$logger->info('invoice Feeeeeee');
		$logger->info($customer_id);
		$custom_fee = 0;
		foreach($invoice->getAllItems() as $items){
			  $orderItem = $items->getOrderItem();
			  $sku = $orderItem->getSku();
			  $pd = $orderItem->getProductId();
			 if($sku == 'freshbox-subscription-recurring'){
				 $custom_fee = 1;
			 }
		}*/

		 $customDiscount = -10;
           
           // $invoice->addTotalAmount('customdiscount', $customDiscount);
           // $invoice->addBaseTotalAmount('customdiscount', $customDiscount);
			 $invoice->setGrandTotal($invoice->getGrandTotal() + $customDiscount);
            $invoice->setBaseGrandTotal($invoice->getBaseGrandTotal() + $customDiscount);
            $invoice->setCustomDiscount($customDiscount);

        $invoice->setFee(0);
        $invoice->setBaseFee(0);
		
        $amount = $invoice->getOrder()->getFee();

		/*if($custom_fee == 1){
			$customer_id = $invoice->getOrder()->getCustomerId();
			$amount = 50;
		}*/
      $invoice->setFee($customDiscount);
        $amount = $invoice->getOrder()->getBaseFee();
        $invoice->setBaseFee($customDiscount);

        //$invoice->setGrandTotal($invoice->getGrandTotal() + $invoice->getFee());
        //$invoice->setBaseGrandTotal($invoice->getBaseGrandTotal() + $invoice->getFee());
		
        return $this;
    }
}
