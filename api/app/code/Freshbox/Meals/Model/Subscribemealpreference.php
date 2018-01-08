<?php
namespace Freshbox\Meals\Model;
/**
 *@api
 */
class Subscribemealpreference extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_meals_settings';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Meals\Model\ResourceModel\Subscribemealpreference');
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
        return $this->getData(self::SUBSCRIBE_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setId($id) {
        $this->setData(self::SUBSCRIBE_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getUserId() {
        return $this->getData(self::SUBSCRIBE_USERID);
    }

    /**
     * @api
     * @param int $preferenceId
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setUserId($preferenceId) {
        $this->setData(self::SUBSCRIBE_USERID, $preferenceId);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getHowmuchMealsWeek() {
        return $this->getData(self::MEALS_WEEK);
    }

    /**
     * @api
     * @param int $howmuch_meals_week
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setHowmuchMealsWeek($howmuch_meals_week) {
        $this->setData(self::MEALS_WEEK, $howmuch_meals_week);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getHowmanyPeople() {
        return $this->getData(self::MANY_PEOPLE);
    }

    /**
     * @api
     * @param int $howmany_people
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setHowmanyPeople($howmany_people) {
        $this->setData(self::MANY_PEOPLE, $howmany_people);
        return $this;
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getMealExtraNotes() {
        return $this->getData(self::EXTRA_NOTES);
    }

    /**
     * @api
     * @param string $meal_extra_notes
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setMealExtraNotes($meal_extra_notes) {
        $this->setData(self::EXTRA_NOTES, $meal_extra_notes);
    }
    /**
     * @api
     * @return string|null
     */
    public function getMealPreferenceSetting() {
        return $this->getData(self::SUBSCRIBE_MEAL_SETTINGS);
    }

    /**
     * @api
     * @param string $meal_preference_setting
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setMealPreferenceSetting($meal_preference_setting) {
        $this->setData(self::SUBSCRIBE_MEAL_SETTINGS, $meal_preference_setting);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getCreationTime() {
        return $this->getData(self::CREATED);
    }

    /**
     * @api
     * @param string $creation_time
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setCreationTime($creation_time) {
        $this->setData(self::CREATED, $creation_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getUpdateTime() {
        return $this->getData(self::UPDATED);
    }

    /**
     * @api
     * @param string $update_time
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATED, $update_time);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsSubscribed() {
        return $this->getData(self::SUBSCRIBE_STATUS);
    }

    /**
     * @api
     * @param int $is_subscribed
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setIsSubscribed($is_subscribed) {
        $this->setData(self::SUBSCRIBE_STATUS, $is_subscribed);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsPaused() {
        return $this->getData(self::SUBSCRIBE_STATUS);
    }

    /**
     * @api
     * @param int $is_paused
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setIsPaused($is_paused) {
        $this->setData(self::SUBSCRIBE_STATUS, $is_paused);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsOrderCreated() {
        return $this->getData(self::IS_ORDER_CREATED);
    }

    /**
     * @api
     * @param int $is_order_created
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setIsOrderCreated($is_order_created) {
        $this->setData(self::IS_ORDER_CREATED, $is_order_created);
    }
	
	
}
