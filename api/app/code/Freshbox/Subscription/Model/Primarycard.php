<?php
namespace Freshbox\Subscription\Model;
/**
 *@api
 */
class Primarycard extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Subscription\Api\Data\PrimarycardInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_subscription_primarycard';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Subscription\Model\ResourceModel\Primarycard');
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
        return $this->getData(self::PRIMARY_CARD_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setId($id) {
        $this->setData(self::PRIMARY_CARD_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getPrimarycardId() {
        return $this->getData(self::PRIMARY_CARD_ID);
    }

    /**
     * @api
     * @param int $primarycardId
     * @return \Freshbox\Subscription\Model\Primarycard 
     */
    public function setPrimarycardId($primarycardId) {
        $this->setData(self::PRIMARY_CARD_ID, $primarycardId);
        return $this;
    }

   
	
	/**
     * @api
     * @return int|null
     */
    public function getUserId() {
        return $this->getData(self::USERID);
    }

    /**
     * @api
     * @param int $user_id
     * @return \Freshbox\Subscription\Model\Primarycard 
     */
    public function setUserId($user_id) {
        $this->setData(self::USERID, $user_id);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getCardId() {
        return $this->getData(self::CARD_ID);
    }

    /**
     * @api
     * @param int $card_id
     * @return \Freshbox\Subscription\Model\Primarycard 
     */
    public function setCardId($card_id) {
        $this->setData(self::CARD_ID, $card_id);
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
     * @return \Freshbox\Subscription\Model\Primarycard 
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
     * @return \Freshbox\Subscription\Model\Primarycard 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATE, $update_time);
    }
	
	
	
}
