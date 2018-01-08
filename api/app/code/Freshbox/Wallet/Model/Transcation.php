<?php
namespace Freshbox\Wallet\Model;
/**
 *@api
 */
class Transcation extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Wallet\Api\Data\TranscationInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_wallet_transcation';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Wallet\Model\ResourceModel\Transcation');
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
        return $this->getData(self::ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setId($id) {
        $this->setData(self::ID, $id);
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
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setCustomerId($customerId) {
        $this->setData(self::CUSTOMER_ID, $customerId);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getRedeemedId() {
        return $this->getData(self::REDEEMED_ID);
    }

    /**
     * @api
     * @param int $customerId
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setRedeemedId($customerId) {
        $this->setData(self::REDEEMED_ID, $customerId);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getStatus() {
        return $this->getData(self::STATUS);
    }

    /**
     * @api
     * @param int $status
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setStatus($status) {
        $this->setData(self::STATUS, $status);
        return $this;
    }

    /**
     * @api
     * @return float
     */
    public function getAmount() {
        return $this->getData(self::AMOUNT);
    }

    /**
     * @api
     * @param float $amount
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setAmount($amount) {
        $this->setData(self::AMOUNT, $amount);
    }
	
	 /**
     * @api
     * @return string|null
     */
    public function getAction() {
        return $this->getData(self::ACTION);
    }

    /**
     * @api
     * @param string $action
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setAction($action) {
        $this->setData(self::ACTION, $action);
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
     * @param string $order_id
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setOrderId($order_id) {
        $this->setData(self::ORDER_ID, $order_id);
    }
	
		
	/**
     * @api
     * @return string|null
     */
    public function getTransactionAt() {
        return $this->getData(self::UPDATE);
    }

    /**
     * @api
     * @param string $transaction_at
     * @return \Freshbox\Wallet\Model\Transcation 
     */
    public function setTransactionAt($transaction_at) {
        $this->setData(self::UPDATE, $transaction_at);
    }

	
}
