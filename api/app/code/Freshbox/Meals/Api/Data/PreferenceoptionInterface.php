<?php
namespace Freshbox\Meals\Api\Data;

interface PreferenceoptionInterface 
{
    const PREFERENCE_OPTION_ID  = 'preference_option_id';
    const PREFERENCE_ID = 'preference_id';
	const PREFERENCE_OPTION_NAME = 'title';
	const QTY_ENABLED = 'qty_enabled';
	const SORT_ORDER = 'sort_order';
	const IS_ACTIVE = 'is_active';
	const PREFERENCE_PRICE = 'price';
    const CREATED = 'creation_time';
    const UPDATED = 'update_time';
   
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $id
     * @return \Freshbox\Meals\Model\Preferenceoption
     */
    public function setId($id);

    /**
     * get cookbook Entity 'cookbook id' property value
     * @return int|null
     */
    public function getPreferenceOptionId();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $preferenceOptionId
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setPreferenceOptionId($preferenceOptionId);
	
	/**
     * get cookbook Entity 'cookbook id' property value
     * @return int|null
     */
    public function getPreferenceId();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $preferenceOptionId
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setPreferenceId($preferenceId);
    
    
	/**
     * get Ingredient 'created' property value
     * @return string|null
     */
    public function getTitle();
	
	/**
     * get cookbook Entity 'cookbook id' property value
     * @return int|null
     */
	public function getQtyEnabled();
	
	/**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $qty_enabled
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
	public function setQtyEnabled($qty_enabled);
	
	/**
     * get cookbook Entity 'cookbook id' property value
     * @return int|null
     */
	public function getIsActive();
	
	/**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $is_active
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
	public function setIsActive($is_active);
	
	/**
     * get cookbook Entity 'cookbook id' property value
     * @return int|null
     */
	 
	  public function getSortOrder();
	  
	  /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $sort_order
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
	  public function setSortOrder($sort_order);
	
	/**
     * set Recipe entity 'created' property value
     * @param string $title
     * @return \Freshbox\Meals\Model\Preferenceoption 
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
     * @return \Freshbox\Meals\Model\Preferenceoption 
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
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setUpdateTime($update_time);
	
		
	/**
     * get Ingredient 'recipe_id' property value
     * @return string|null
     */
    public function getPrice();
	
	/**
     * set Recipe entity 'recipe_id' property value
     * @param string $price
     * @return \Freshbox\Meals\Model\Preferenceoption
     */
    public function setPrice($price);
	
	
	
}