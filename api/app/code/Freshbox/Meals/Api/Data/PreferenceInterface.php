<?php
namespace Freshbox\Meals\Api\Data;

interface PreferenceInterface 
{
    const PREFERENCE_ID  = 'preference_id';
   
    const PREFERENCE_TITLE = 'title';
    const CREATED = 'creation_time';
    const UPDATED = 'update_time';
    const STATUS = 'is_active';
   
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $mealId
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setId($mealId);

    /**
     * get Meals Entity 'Meals id' property value
     * @return int|null
     */
    public function getPreferenceId();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $mealId
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setPreferenceId($mealId);
    
    /**
     * get Ingredient 'title' property value
     * @return string|null
     */
    public function getTitle();

    /**
     * set Recipe entity 'title' property value
     * @param string $title
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setTitle($title);
	
	/**
     * get Ingredient 'created' property value
     * @return string|null
     */
    public function getCreationTime();
	
	/**
     * set Recipe entity 'created' property value
     * @param string $creation_time
     * @return \Freshbox\Meals\Model\Preference 
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
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setUpdateTime($update_time);
	
	/**
     * get Ingredient 'status' property value
     * @return int|null
     */
    public function getIsActive();
	
	/**
     * set Recipe entity 'status' property value
     * @param int $is_active
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setIsActive($is_active);
	
	
	
}
