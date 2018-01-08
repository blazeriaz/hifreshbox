<?php
/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Sivajik34\CustomFee\Model\Quote\Total;

use Magento\Store\Model\ScopeInterface;

class Fee extends \Magento\Quote\Model\Quote\Address\Total\AbstractTotal
{

    protected $helperData;

    /**
     * Collect grand total address amount
     *
     * @param \Magento\Quote\Model\Quote $quote
     * @param \Magento\Quote\Api\Data\ShippingAssignmentInterface $shippingAssignment
     * @param \Magento\Quote\Model\Quote\Address\Total $total
     * @return $this
     */
    protected $quoteValidator = null;

    public function __construct(\Magento\Quote\Model\QuoteValidator $quoteValidator,
                                \Sivajik34\CustomFee\Helper\Data $helperData,
                                \Freshbox\Wallet\Model\ResourceModel\Record\CollectionFactory $recordCollectionFactory)
    {
        $this->quoteValidator = $quoteValidator;
        $this->helperData = $helperData;
        $this->recordCollectionFactory    = $recordCollectionFactory;
    }

    public function collect(
        \Magento\Quote\Model\Quote $quote,
        \Magento\Quote\Api\Data\ShippingAssignmentInterface $shippingAssignment,
        \Magento\Quote\Model\Quote\Address\Total $total
    )
    {
        parent::collect($quote, $shippingAssignment, $total);
        if (!count($shippingAssignment->getItems())) {
            return $this;
        }

            $customDiscount = -10;

             $total->setFee($customDiscount);
            $total->setBaseFee($customDiscount);
            $quote->setFee($customDiscount);
            $quote->setBaseFee($customDiscount);
 
            $total->addTotalAmount('customdiscount', $customDiscount);
            $total->addBaseTotalAmount('customdiscount', $customDiscount);
            $total->setBaseGrandTotal($total->getBaseGrandTotal() + $customDiscount);
            $quote->setCustomDiscount($customDiscount);

     /*   $writer = new \Zend\Log\Writer\Stream(BP . '/var/log/test.log');
$logger = new \Zend\Log\Logger();
$logger->addWriter($writer);
$logger->info('*****H*******E********L******************L*************O');
//$total_amt = $total->getGrandTotal() - 60;
//$logger->info($total_amt);

       
		

        $enabled = $this->helperData->isModuleEnabled();
        $minimumOrderAmount = $this->helperData->getMinimumOrderAmount();
        $subtotal = $total->getTotalAmount('subtotal');
       // if ($enabled && $minimumOrderAmount <= $subtotal) {
            $fee = $quote->getFee();
            //Try to test with sample value
            $fee = 5;
            $total->setTotalAmount('fee', $fee);
            $total->setBaseTotalAmount('fee', $fee);
            $total->setFee($fee);
            $total->setBaseFee($fee);
            $quote->setFee($fee);
            $quote->setBaseFee($fee);
            $total->setGrandTotal($total->getGrandTotal() - $fee);
            $total->setBaseGrandTotal($total->getBaseGrandTotal() - $fee);
      //  }*/
        return $this;
    }

    /**
     * @param \Magento\Quote\Model\Quote $quote
     * @param \Magento\Quote\Model\Quote\Address\Total $total
     * @return array
     */
    public function fetch(\Magento\Quote\Model\Quote $quote, \Magento\Quote\Model\Quote\Address\Total $total)
    {

        $enabled = $this->helperData->isModuleEnabled();
        $minimumOrderAmount = $this->helperData->getMinimumOrderAmount();
        $subtotal = $quote->getSubtotal();
        $fee = $quote->getFee();
        $fee = 5;
        $httpRequestObject = new \Zend_Controller_Request_Http();
		$tokenss = $httpRequestObject->getHeader('Authorization');
		
		if($tokenss != 'Bearer null'){
		$search = 'Bearer ';
		$token = str_replace($search,'',$tokenss);
       $customerId = $quote->getCustomer()->getId();

         $wallet_record = $this->recordCollectionFactory->create();
                $wallet_record->addFieldToFilter('customer_id', $customerId);
                  if($wallet_record->count() > 0){
                        $wallet_rd = $wallet_record->getFirstItem();

                       $record_id = $wallet_rd->getId();
                       $total_amount = $wallet_rd->getTotalAmount();
                       $remaining_amount = $wallet_rd->getRemainingAmount();
                       $used_amount = $wallet_rd->getUsedAmount();
                        $available_wallet_money = $remaining_amount;
                  }else{
                      $available_wallet_money = 0;
                  }
       
       

        }else{
            $available_wallet_money = 0;
        }

        $result = [];
        if ($enabled && ($minimumOrderAmount <= $subtotal) && $fee) {
            $result = [
                'code' => 'fee',
                'title' => __('Wallet Available Amount ($%1)', $available_wallet_money),
                'value' => 10
            ];
        }
        return $result;
    }

    /**
     * Get Subtotal label
     *
     * @return \Magento\Framework\Phrase
     */
    public function getLabel()
    {
        return 'Wallet Money';
    }

    /**
     * @param \Magento\Quote\Model\Quote\Address\Total $total
     */
    protected function clearValues(\Magento\Quote\Model\Quote\Address\Total $total)
    {
        // $enabled = $this->helperData->isModuleEnabled();
        // $minimumOrderAmount = $this->helperData->getMinimumOrderAmount();
        // $subtotal = $total->getTotalAmount('subtotal');
        $total->setTotalAmount('subtotal', 0);
        $total->setBaseTotalAmount('subtotal', 0);
        $total->setTotalAmount('tax', 0);
        $total->setBaseTotalAmount('tax', 0);
        $total->setTotalAmount('discount_tax_compensation', 0);
        $total->setBaseTotalAmount('discount_tax_compensation', 0);
        $total->setTotalAmount('shipping_discount_tax_compensation', 0);
        $total->setBaseTotalAmount('shipping_discount_tax_compensation', 0);
        $total->setSubtotalInclTax(0);
        $total->setBaseSubtotalInclTax(0);

    }
}
