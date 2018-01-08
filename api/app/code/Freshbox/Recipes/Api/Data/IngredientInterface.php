<?php
namespace Freshbox\Recipes\Api\Data;

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
     * @return \Freshbox\Recipes\Model\Ingredient 
     */
    public function setId($ingredientId);

    /**
     * get Recipe Entity 'ingredient id' property value
     * @return int|null
     */
    public function getIngredientId();

    /**
     * set Recipe entity 'ingredient Id' property value
     * @param int $ingredientId
     * @return \Freshbox\Recipes\Model\Ingredient 
     */
    public function setIngredientId($ingredientId);
    
    /**
     * get Recipe 'title' property value
     * @return string|null
     */
    public function getTitle();

    /**
     * set Recipe entity 'title' property value
     * @param string $title
     * @return \Freshbox\Recipes\Model\Ingredient 
     */
    public function setTitle($title);
	
	
}
