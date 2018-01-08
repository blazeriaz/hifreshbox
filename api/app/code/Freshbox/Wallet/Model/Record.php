<?php
namespace Freshbox\Wallet\Model;
/**
 *@api
 */
class Record extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Wallet\Api\Data\RecordInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_wallet_record';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Wallet\Model\ResourceModel\Record');
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
     * @return \Freshbox\Wallet\Model\Record 
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
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setCustomerId($customerId) {
        $this->setData(self::CUSTOMER_ID, $customerId);
        return $this;
    }

    /**
     * @api
     * @return float
     */
    public function getTotalAmount() {
        return $this->getData(self::TOTAL_AMOUNT);
    }

    /**
     * @api
     * @param float $total_amount
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setTotalAmount($total_amount) {
        $this->setData(self::TOTAL_AMOUNT, $total_amount);
    }
	
	  /**
     * @api
     * @return float
     */
    public function getRemainingAmount() {
        return $this->getData(self::REMAINING_AMOUNT);
    }

    /**
     * @api
     * @param float $remaining_amount
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setRemainingAmount($remaining_amount) {
        $this->setData(self::REMAINING_AMOUNT, $remaining_amount);
    }
	
	  /**
     * @api
     * @return float
     */
    public function getUsedAmount() {
        return $this->getData(self::USED_AMOUNT);
    }

    /**
     * @api
     * @param float $used_amount
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setUsedAmount($used_amount) {
        $this->setData(self::USED_AMOUNT, $used_amount);
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
     * @return \Freshbox\Wallet\Model\Record 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATE, $update_time);
    }

	
}
