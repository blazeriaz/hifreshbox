<?php
namespace Freshbox\Ingredients\Api\Data;

interface IngredientInterface 
{
    const INGREDIENT_ID  = 'ingredient_id';
   
    const INGREDIENT_TITLE = 'title';
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
     * @param int $ingredientId
     * @return \Freshbox\Ingredients\Model\Ingredient 
     */
    public function setId($ingredientId);

    /**
     * get Ingredient Entity 'ingredient id' property value
     * @return int|null
     */
    public function getIngredientId();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $ingredientId
     * @return \Freshbox\Ingredients\Model\Ingredient 
     */
    public function setIngredientId($ingredientId);
    
    /**
     * get Ingredient 'title' property value
     * @return string|null
     */
    public function getTitle();

    /**
     * set Recipe entity 'title' property value
     * @param string $title
     * @return \Freshbox\Ingredients\Model\Ingredient 
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
     * @return \Freshbox\Ingredients\Model\Ingredient 
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
     * @return \Freshbox\Ingredients\Model\Ingredient 
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
     * @return \Freshbox\Ingredients\Model\Ingredient 
     */
    public function setIsActive($is_active);
	
	
	
}
