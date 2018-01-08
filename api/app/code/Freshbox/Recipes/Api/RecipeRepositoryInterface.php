<?php
namespace Freshbox\Recipes\Api;

//use Freshbox\Recipes\Model\RecipeInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface RecipeRepositoryInterface
{
    /**
     * Save recipe.
     * @param \Freshbox\Recipes\Api\Data\RecipeInterface $recipe
     * @return \Freshbox\Recipes\Api\Data\RecipeInterface
     *
     */
    public function save(\Freshbox\Recipes\Api\Data\RecipeInterface  $recipe);

    /**
     *  Slide.
     * @param int $recipeId
     * @return \Freshbox\Recipes\Api\Data\RecipeInterface
     *
     */
    public function getById($recipeId);

    /**
     * Retrive recipes matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);

    /**
     * @param Freshbox\Recipes\Api\Data\RecipeInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Recipes\Api\Data\RecipeInterface $page);

    /**
     * @param int $recipeId
     * @return bool true on success
     */
    public function deleteById($recipeId);
	
	/**
     * Save data.
     * @param mixed $pdfdata
     * @return array
     *
     */
	public function updatepdf($pdfdata);
}
