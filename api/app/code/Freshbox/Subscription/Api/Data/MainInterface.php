<?php
namespace Freshbox\Subscription\Api\Data;

interface MainInterface 
{
    const SUBSCRIPTION_ID  = 'subscription_id';
   
    const ORDER_ID = 'order_id';
    const USERID = 'user_id';
   
   const IS_ACTIVE = 'is_active';
   const CREATION = 'creation_time';
   const UPDATE = 'update_time';
   const SORT_ORDER = 'sort_order';
   const WEEK_MEALS = 'meals_in_weeks';
   const LAST_CRON = 'last_cron_run';
   const WEEK_NO = 'week_no';
   const YEAR = 'year';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $subscriptionId
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setId($subscriptionId);

    /**
     * get Faq Entity 'faq id' property value
     * @return int|null
     */
    public function getSubscriptionId();

    /**
     * set faq entity 'protion Id' property value
     * @param int $subscriptionId
     * @return \Freshbox\Subscription\Model\Main  
     */
    public function setSubscriptionId($subscriptionId);
    
    /**
     * get subscription 'orderid' property value
     * @return string|null
     */
    public function getOrderId();

    /**
     * set faq entity 'question' property value
     * @param string $order_id
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setOrderId($order_id);
	
	/**
     * get subscription 'userid' property value
     * @return int|null
     */
    public function getUserId();

    /**
     * set faq entity 'answer' property value
     * @param int $user_id
     * @return \Freshbox\Subscription\Model\Main 
     */
    public function setUserId($user_id);
	
	 /**
     * get faq 'is_active' property value
     * @return int|null
     */
    public function getIsActive();
	
	/**
     * set faq entity 'is_active' property value
     * @param int $is_active
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setIsActive($is_active);
	
	 /**
     * get faq 'week_no' property value
     * @return int|null
     */
    public function getWeekNo();
	
	/**
     * set faq entity 'is_active' property value
     * @param int $week_no
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setWeekNo($week_no);
	
	/**
     * get faq 'creation_time' property value
     * @return string|null
     */
    public function getCreationTime();

    /**
     * set faq entity 'creation_time' property value
     * @param string $creation_time
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setCreationTime($creation_time);
	
	/**
     * get faq 'meals_in_weeks' property value
     * @return string|null
     */
    public function getMealsInWeeks();

    /**
     * set faq entity 'meals_in_weeks' property value
     * @param string $meals_in_weeks
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setMealsInWeeks($meals_in_weeks);
	
	/**
     * get faq 'year' property value
     * @return string|null
     */
    public function getYear();

    /**
     * set faq entity 'meals_in_weeks' property value
     * @param string $year
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setYear($year);
	
	
	
	/**
     * get faq 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();

    /**
     * set faq entity 'update_time' property value
     * @param string $update_time
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setUpdateTime($update_time);
	
	/**
     * get faq 'last_cron_run' property value
     * @return string|null
     */
    public function getLastCronRun();

    /**
     * set faq entity 'update_time' property value
     * @param string $last_cron_run
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setLastCronRun($last_cron_run);
	
	/**
     * get faq 'sort_order' property value
     * @return int|null
     */
    public function getSortOrder();
	
	/**
     * set faq entity 'sort_order' property value
     * @param int $sort_order
     * @return \Freshbox\Subscription\Model\Main
     */
    public function setSortOrder($sort_order);
	
	
}
