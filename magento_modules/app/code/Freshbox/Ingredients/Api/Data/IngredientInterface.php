<?php
namespace Freshbox\Ingredients\Api\Data;

interface IngredientInterface 
{
    const INGREDIENT_ID  = 'ingredient_id';
   
    const INGREDIENT_TITLE = 'title';
   

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
	
	
}
