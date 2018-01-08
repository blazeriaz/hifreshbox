<?php
namespace Freshbox\Subscription\Model;
/**
 *@api
 */
class Pause extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Subscription\Api\Data\PauseInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_subscription_pause';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Subscription\Model\ResourceModel\Pause');
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
        return $this->getData(self::PAUSE_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setId($id) {
        $this->setData(self::PAUSE_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getPauseId() {
        return $this->getData(self::PAUSE_ID);
    }

    /**
     * @api
     * @param int $pauseId
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setPauseId($pauseId) {
        $this->setData(self::PAUSE_ID, $pauseId);
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
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setUserId($user_id) {
        $this->setData(self::USERID, $user_id);
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
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setCreationTime($creation_time) {
        $this->setData(self::CREATION, $creation_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getStartDate() {
        return $this->getData(self::START_DATE);
    }

    /**
     * @api
     * @param string $start_date
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setStartDate($start_date) {
        $this->setData(self::START_DATE, $start_date);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getEndDate() {
        return $this->getData(self::END_DATE);
    }

    /**
     * @api
     * @param string $end_date
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setEndDate($end_date) {
        $this->setData(self::END_DATE, $end_date);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getYear() {
        return $this->getData(self::YEAR);
    }

    /**
     * @api
     * @param string $year
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setYear($year) {
        $this->setData(self::YEAR, $year);
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
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATE, $update_time);
    }
	
	
	
	/**
     * @api
     * @return int|null
     */
    public function getWeekNo() {
        return $this->getData(self::WEEK_NO);
    }

    /**
     * @api
     * @param int $week_no
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setWeekNo($week_no) {
        $this->setData(self::WEEK_NO, $week_no);
        return $this;
    }
	
}
