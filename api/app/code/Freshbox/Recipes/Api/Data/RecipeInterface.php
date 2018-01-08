<?php
namespace Freshbox\Recipes\Api\Data;

interface RecipeInterface 
{
    const PROPERTY_ID  = 'recipe_id';
    const PROPERTY_RECIPE_ID = 'recipe_id';
    const PROPERTY_TITLE = 'title';
    const PROPERTY_IMAGE = 'image';
    const PROPERTY_CHEF_NAME = 'chef_name';
    const PROPERTY_COOKING_TIME = 'cooking_time';
    const PROPERTY_SERVINGS = 'servings';
    const PROPERTY_DESCRIPTION = 'description';
    const PROPERTY_PDF_ATTACHMENT = 'pdf_attachment';

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $recipeId
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setId($recipeId);

    /**
     * get Recipe Entity 'recipe_id' property value
     * @return int|null
     */
    public function getRecipeId();

    /**
     * set Recipe entity 'recipe_id' property value
     * @param int $recipeId
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setSlideId($recipeId);
    
    /**
     * get Recipe 'title' property value
     * @return string|null
     */
    public function getTitle();

    /**
     * set Recipe entity 'title' property value
     * @param string $title
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setTitle($title);
	
	/**
     * get Recipe entity 'image' property value
     * @return string|null
     */
    public function getImage();

    /**
     * set Recipe entity 'image' property value
     * @param string $image
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setImage($image);
	
	
	/**
     * get Recipe 'image' property value
     * @return string|null
     */
    public function getChefName();

    /**
     * set Recipe 'chefname' property value
     * @param string $chefname
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setChefName($chefname);
	
	/**
     * get Recipe 'cooking time' property value
     * @return string|null
     */
    public function getCookingTime();

    /**
     * set Recipe 'cooking time' property value
     * @param string $cookingtime
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setCookingTime($cookingtime);
	
	/**
     * get Recipe 'servings time' property value
     * @return string|null
     */
    public function getServings();

    /**
     * set Recipe 'servings' property value
     * @param string $servings
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setServings($servings);
	
	/**
     * get Recipe 'description' property value
     * @return string|null
     */
    public function getDescription();

    /**
     * set Recipe 'description' property value
     * @param string $description
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setDescription($description);
	
	/**
     * get Recipe 'pdf_attachment' property value
     * @return string|null
     */
    public function getPdfAttachment();

    /**
     * set Recipe 'pdf_attachment' property value
     * @param string $pdfattachment
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setPdfAttachment($pdfattachment);
}
