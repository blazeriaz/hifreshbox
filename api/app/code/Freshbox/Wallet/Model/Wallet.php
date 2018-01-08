<?php
namespace Freshbox\Wallet\Model;
/**
 *@api
 */
class Wallet extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Wallet\Api\Data\WalletInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_wallet_wallet';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Wallet\Model\ResourceModel\Wallet');
    }

    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * @api
     * @return int|null
     */
    public function getId() {
        return $this->getData(self::WALLET_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setId($id) {
        $this->setData(self::WALLET_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getWalletId() {
        return $this->getData(self::WALLET_ID);
    }

    /**
     * @api
     * @param int $walletId
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setWalletId($walletId) {
        $this->setData(self::WALLET_ID, $walletId);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getCustomerId() {
        return $this->getData(self::CUSTOMER_ID);
    }

    /**
     * @api
     * @param int $customerId
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setCustomerId($customerId) {
        $this->setData(self::CUSTOMER_ID, $customerId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getOrderId() {
        return $this->getData(self::ORDER_ID);
    }

    /**
     * @api
     * @param string $orderId
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setOrderId($orderId) {
        $this->setData(self::ORDER_ID, $orderId);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsRedeemed() {
        return $this->getData(self::IS_REDEEMED);
    }

    /**
     * @api
     * @param int $is_redeemed
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setIsRedeemed($is_redeemed) {
        $this->setData(self::IS_REDEEMED, $is_redeemed);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getRedeemedUser() {
        return $this->getData(self::REDEEMED_USER);
    }

    /**
     * @api
     * @param int $redeemed_user
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setRedeemedUser($redeemed_user) {
        $this->setData(self::REDEEMED_USER, $redeemed_user);
        return $this;
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getRedeemedCode() {
        return $this->getData(self::REDEEMED_CODE);
    }
	
    /**
     * @api
     * @param string $redeemed_code
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setRedeemedCode($redeemed_code) {
        $this->setData(self::REDEEMED_CODE, $redeemed_code);
    }
	
	
	/**
     * @api
     * @return string|null
     */
    public function getFromName() {
        return $this->getData(self::FROM_NAME);
    }
	
    /**
     * @api
     * @param string $from_name
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setFromName($from_name) {
        $this->setData(self::FROM_NAME, $from_name);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getToFirstName() {
        return $this->getData(self::TO_FNAME);
    }

    /**
     * @api
     * @param string $to_first_name
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setToFirstName($to_first_name) {
        $this->setData(self::TO_FNAME, $to_first_name);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getToLastName() {
        return $this->getData(self::TO_LNAME);
    }

    /**
     * @api
     * @param string $to_last_name
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setToLastName($to_last_name) {
        $this->setData(self::TO_LNAME, $to_last_name);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getToEmail() {
        return $this->getData(self::TO_EMAIL);
    }

    /**
     * @api
     * @param string $to_email
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setToEmail($to_email) {
        $this->setData(self::TO_EMAIL, $to_email);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getMessage() {
        return $this->getData(self::MESSAGE);
    }

    /**
     * @api
     * @param string $message
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setMessage($message) {
        $this->setData(self::MESSAGE, $message);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getAmount() {
        return $this->getData(self::AMOUNT);
    }

    /**
     * @api
     * @param int $amount
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setAmount($amount) {
        $this->setData(self::AMOUNT, $amount);
        return $this;
    }
	
	
	
	/**
     * @api
     * @return string|null
     */
    public function getCreationTime() {
        return $this->getData(self::CREATION);
    }

    /**
     * @api
     * @param string $creation_time
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setCreationTime($creation_time) {
        $this->setData(self::CREATION, $creation_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getUpdateTime() {
        return $this->getData(self::UPDATE);
    }

    /**
     * @api
     * @param string $update_time
     * @return \Freshbox\Wallet\Model\Wallet 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATE, $update_time);
    }

	
}
