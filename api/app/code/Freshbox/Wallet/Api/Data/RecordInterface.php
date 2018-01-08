<?php
namespace Freshbox\Wallet\Api\Data;

interface RecordInterface 
{
    const ID  = 'id';   
    const CUSTOMER_ID = 'customer_id';
    const TOTAL_AMOUNT = 'total_amount';
    const REMAINING_AMOUNT = 'remaining_amount';
    const USED_AMOUNT = 'used_amount';
    const UPDATE = 'update_time';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $id
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setId($id);

   	
	/**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getCustomerId();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $customerId
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setCustomerId($customerId);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return float
     */
    public function getTotalAmount();

    /**
     * set Portion entity 'protion Id' property value
     * @param float $total_amount
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setTotalAmount($total_amount);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return float
     */
    public function getRemainingAmount();

    /**
     * set Portion entity 'protion Id' property value
     * @param float $remaining_amount
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setRemainingAmount($remaining_amount);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return float
     */
    public function getUsedAmount();

    /**
     * set Portion entity 'protion Id' property value
     * @param float $used_amount
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setUsedAmount($used_amount);
	
	
	/**
     * get Portion 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();

    /**
     * set Portion entity 'update_time' property value
     * @param string $update_time
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setUpdateTime($update_time);
	
	
}
