<?php
namespace Freshbox\Cookbook\Api\Data;

interface BookSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Cookbook\Api\Data\BookInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Cookbook\Api\Data\BookInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
