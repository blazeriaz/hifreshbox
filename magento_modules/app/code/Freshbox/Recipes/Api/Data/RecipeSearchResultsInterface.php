<?php
namespace Jeff\Slider\Api\Data;

interface SlideSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Jeff\Slider\Api\Data\RecipeInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Jeff\Slider\Api\Data\RecipeInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
