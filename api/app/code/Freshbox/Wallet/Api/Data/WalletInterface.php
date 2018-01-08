<?php
namespace Freshbox\Wallet\Api\Data;

interface WalletInterface 
{
    const WALLET_ID  = 'wallet_id';   
    const CUSTOMER_ID = 'customer_id';
    const ORDER_ID = 'order_id';
    const IS_REDEEMED = 'is_redeemed';
    const REDEEMED_USER = 'redeemed_user';
    const REDEEMED_CODE = 'redeemed_code';   
    const FROM_NAME = 'from_name';
    const TO_FNAME = 'to_first_name';
    const TO_LNAME = 'to_last_name';
    const TO_EMAIL = 'to_email';
    const MESSAGE = 'message';
    const AMOUNT = 'amount';
    const CREATION = 'creation_time';
    const UPDATE = 'update_time';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $walletId
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setId($walletId);

    /**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getWalletId();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $walletId
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setWalletId($walletId);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getCustomerId();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $customerId
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setCustomerId($customerId);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return string|null
     */
    public function getOrderId();

    /**
     * set Portion entity 'protion Id' property value
     * @param string $orderId
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setOrderId($orderId);
	
	
	/**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getIsRedeemed();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $is_redeemed
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setIsRedeemed($is_redeemed);
	
	/**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getRedeemedUser();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $redeemed_user
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setRedeemedUser($redeemed_user);
	
    
    /**
     * get Portion 'title' property value
     * @return string|null
     */
    public function getFromName();

    /**
     * set Portion entity 'title' property value
     * @param string $from_name
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setFromName($from_name);
	
	/**
     * get Portion 'title' property value
     * @return string|null
     */
    public function getToFirstName();

    /**
     * set Portion entity 'title' property value
     * @param string $to_first_name
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setToFirstName($to_first_name);
	
	/**
     * get Portion 'title' property value
     * @return string|null
     */
    public function getToLastName();

    /**
     * set Portion entity 'title' property value
     * @param string $to_last_name
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setToLastName($to_last_name);
	
	/**
     * get Portion 'title' property value
     * @return string|null
     */
    public function getRedeemedCode();

    /**
     * set Portion entity 'title' property value
     * @param string $redeemed_code
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setRedeemedCode($redeemed_code);
	
	/**
     * get Portion 'title' property value
     * @return string|null
     */
    public function getToEmail();

    /**
     * set Portion entity 'title' property value
     * @param string $to_email
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setToEmail($to_email);
	
	/**
     * get Portion 'title' property value
     * @return string|null
     */
    public function getMessage();

    /**
     * set Portion entity 'title' property value
     * @param string $message
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setMessage($message);
	
	/**
     * get Portion 'title' property value
     * @return int|null
     */
    public function getAmount();

    /**
     * set Portion entity 'title' property value
     * @param int $amount
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setAmount($amount);
	
	
	/**
     * get Portion 'creation_time' property value
     * @return string|null
     */
    public function getCreationTime();

    /**
     * set Portion entity 'creation_time' property value
     * @param int $creation_time
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setCreationTime($creation_time);

	
	/**
     * get Portion 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();

    /**
     * set Portion entity 'update_time' property value
     * @param string $update_time
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setUpdateTime($update_time);
	
	
}
