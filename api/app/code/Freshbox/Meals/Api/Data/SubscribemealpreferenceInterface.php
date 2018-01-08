<?php
namespace Freshbox\Meals\Api\Data;

interface SubscribemealpreferenceInterface 
{
    const SUBSCRIBE_ID  = 'id';
    const SUBSCRIBE_USERID = 'user_id';
    const SUBSCRIBE_MEAL_SETTINGS = 'meal_preference_settings';
	const MEALS_WEEK = 'howmuch_meals_week';
	const MANY_PEOPLE = 'howmany_people';
	const EXTRA_NOTES = 'meal_extra_notes';	
    const SUBSCRIBE_STATUS = 'is_subscribed';
    const SUBSCRIBE_PAUSED = 'is_paused';
    const CREATED = 'creation_time';
    const UPDATED = 'update_time';
    const IS_ORDER_CREATED = 'is_order_created';
   
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $subscribeId
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setId($subscribeId);

    /**
     * get Meals Entity 'Meals id' property value
     * @return int|null
     */
    public function getUserId();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $user_id
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setUserId($user_id);
	
	
	 /**
     * get Meals Entity 'Meals id' property value
     * @return int|null
     */
    public function getHowmuchMealsWeek();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $howmuch_meals_week
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setHowmuchMealsWeek($howmuch_meals_week);
	
	
	/**
     * get Meals Entity 'Meals id' property value
     * @return int|null
     */
    public function getHowmanyPeople();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $howmany_people
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setHowmanyPeople($howmany_people);
	
	
	/**
     * get Ingredient 'title' property value
     * @return string|null
     */
    public function getMealExtraNotes();

    /**
     * set Recipe entity 'title' property value
     * @param string $meal_extra_notes
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setMealExtraNotes($meal_extra_notes);
    
    /**
     * get Ingredient 'title' property value
     * @return string
     */
    public function getMealPreferenceSetting();

    /**
     * set Recipe entity 'title' property value
     * @param string $meal_preference_setting
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setMealPreferenceSetting($meal_preference_setting);
	
	/**
     * get Ingredient 'created' property value
     * @return string|null
     */
    public function getCreationTime();
	
	/**
     * set Recipe entity 'created' property value
     * @param string $creation_time
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setCreationTime($creation_time);
	
	/**
     * get Ingredient 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();
	
	/**
     * set Recipe entity 'modified' property value
     * @param string $update_time
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setUpdateTime($update_time);
	
	/**
     * get Ingredient 'status' property value
     * @return int|null
     */
    public function getIsSubscribed();
	
	/**
     * set Recipe entity 'status' property value
     * @param int $is_subscribed
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setIsSubscribed($is_subscribed);
	
	/**
     * get Ingredient 'status' property value
     * @return int|null
     */
    public function getIsPaused();
	
	/**
     * set Recipe entity 'status' property value
     * @param int $is_paused
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setIsPaused($is_paused);
	
	/**
     * get Ingredient 'status' property value
     * @return int|null
     */
    public function getIsOrderCreated();
	
	/**
     * set Recipe entity 'status' property value
     * @param int $is_order_created
     * @return \Freshbox\Meals\Model\Subscribemealpreference 
     */
    public function setIsOrderCreated($is_order_created);
	
	
	
}
