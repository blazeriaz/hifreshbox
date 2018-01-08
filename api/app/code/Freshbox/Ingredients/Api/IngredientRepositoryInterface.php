<?php
namespace Freshbox\Ingredients\Api;

//use Freshbox\Ingredients\Model\IngredientInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface IngredientRepositoryInterface
{
    /**
     * Save ingredient.
     * @param \Freshbox\Ingredients\Api\Data\IngredientInterface $recipe
     * @return \Freshbox\Ingredients\Api\Data\IngredientInterface
     *
     */
    public function save(\Freshbox\Ingredients\Api\Data\IngredientInterface  $ingredient);

    /**
     *  Slide.
     * @param int $ingredientId
     * @return \Freshbox\Ingredients\Api\Data\IngredientInterface
     *
     */
    public function getById($ingredientId);

    /**
     * Retrive ingredients matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Ingredients\Api\Data\IngredientInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Ingredients\Api\Data\IngredientInterface $page);

    /**
     * @param int $ingredientId
     * @return bool true on success
     */
    public function deleteById($ingredientId);
}
