<?php
namespace Freshbox\Cookbook\Api\Data;

interface BookrecipeSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Cookbook\Api\Data\BookrecipeInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Cookbook\Api\Data\BookrecipeInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
