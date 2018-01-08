<?php
namespace Freshbox\Wallet\Api\Data;

interface TranscationInterface 
{
    const ID  = 'id';   
    const CUSTOMER_ID = 'customer_id';
    const REDEEMED_ID = 'redeemed_id';
    const AMOUNT = 'amount';
    const STATUS = 'status';
    const ACTION = 'action';
    const ORDER_ID = 'order_id';
    const UPDATE = 'transaction_at';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $id
     * @return \Freshbox\Wallet\Model\Transcation 
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
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setCustomerId($customerId);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getRedeemedId();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $redeemed_id
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setRedeemedId($redeemed_id);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return float
     */
    public function getAmount();

    /**
     * set Portion entity 'protion Id' property value
     * @param float $amount
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setAmount($amount);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getStatus();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $status
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setStatus($status);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return string
     */
    public function getAction();

    /**
     * set Portion entity 'protion Id' property value
     * @param string|null $action
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setAction($action);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return string
     */
    public function getOrderId();

    /**
     * set Portion entity 'protion Id' property value
     * @param string|null $order_id
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setOrderId($order_id);
	
	
	/**
     * get Portion 'update_time' property value
     * @return string|null
     */
    public function getTransactionAt();

    /**
     * set Portion entity 'update_time' property value
     * @param string $transaction_at
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setTransactionAt($transaction_at);
	
	
}
