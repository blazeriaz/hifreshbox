<?php
namespace Freshbox\Subscription\Model;
/**
 *@api
 */
class Main extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Subscription\Api\Data\MainInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_subscription_main';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Subscription\Model\ResourceModel\Main');
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
        return $this->getData(self::SUBSCRIPTION_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setId($id) {
        $this->setData(self::SUBSCRIPTION_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getSubscriptionId() {
        return $this->getData(self::SUBSCRIPTION_ID);
    }

    /**
     * @api
     * @param int $subscriptionId
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setSubscriptionId($subscriptionId) {
        $this->setData(self::SUBSCRIPTION_ID, $subscriptionId);
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
     * @param string $order_id
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setOrderId($order_id) {
        $this->setData(self::ORDER_ID, $order_id);
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
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setUserId($user_id) {
        $this->setData(self::USERID, $user_id);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsActive() {
        return $this->getData(self::IS_ACTIVE);
    }

    /**
     * @api
     * @param int $is_active
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setIsActive($is_active) {
        $this->setData(self::IS_ACTIVE, $is_active);
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
     * @return \Freshbox\Subscription\Model\Main 
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
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATE, $update_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getMealsInWeeks() {
        return $this->getData(self::WEEK_MEALS);
    }

    /**
     * @api
     * @param string $meals_in_weeks
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setMealsInWeeks($meals_in_weeks) {
        $this->setData(self::WEEK_MEALS, $meals_in_weeks);
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
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setYear($year) {
        $this->setData(self::YEAR, $year);
    }
	
	
	/**
     * @api
     * @return string|null
     */
    public function getLastCronRun() {
        return $this->getData(self::LAST_CRON);
    }

    /**
     * @api
     * @param string $last_cron_run
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setLastCronRun($last_cron_run) {
        $this->setData(self::LAST_CRON, $last_cron_run);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getSortOrder() {
        return $this->getData(self::SORT_ORDER);
    }

    /**
     * @api
     * @param int $sort_order
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setSortOrder($sort_order) {
        $this->setData(self::SORT_ORDER, $sort_order);
        return $this;
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
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setWeekNo($week_no) {
        $this->setData(self::WEEK_NO, $week_no);
        return $this;
    }
	
}
