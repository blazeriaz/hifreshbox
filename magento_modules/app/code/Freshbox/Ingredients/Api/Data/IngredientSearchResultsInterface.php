<?php
namespace Freshbox\Ingredients\Api\Data;

interface IngredientSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Ingredients\Api\Data\IngredientInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Ingredients\Api\Data\IngredientInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
