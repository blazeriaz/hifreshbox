<?php
namespace Freshbox\Cookbook\Api\Data;

interface BookrecipeInterface 
{
    const COOKBOOK_RECIPE_ID  = 'id';
    const COOKBOOK_ID = 'cookbook_id';
	const RECIPE_ID = 'recipe_id';
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
     * @return \Freshbox\Cookbook\Model\Bookrecipe
     */
    public function setId($id);

    /**
     * get cookbook Entity 'cookbook id' property value
     * @return int|null
     */
    public function getCookbookId();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $cookbookId
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
     */
    public function setCookbookId($cookbookId);
    
    
	
	/**
     * get Ingredient 'created' property value
     * @return string|null
     */
    public function getCreationTime();
	
	/**
     * set Recipe entity 'created' property value
     * @param string $creation_time
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
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
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
     */
    public function setUpdateTime($update_time);
	
		
	/**
     * get Ingredient 'recipe_id' property value
     * @return string|null
     */
    public function getRecipeId();
	
	/**
     * set Recipe entity 'recipe_id' property value
     * @param string $recipe_id
     * @return \Freshbox\Cookbook\Model\Bookrecipe
     */
    public function setRecipeId($recipe_id);
	
	
	
}