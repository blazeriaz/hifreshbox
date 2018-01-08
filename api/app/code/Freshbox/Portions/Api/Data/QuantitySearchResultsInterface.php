<?php
namespace Freshbox\Portions\Api\Data;

interface QuantitySearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Portions\Api\Data\QuantityInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Portions\Api\Data\QuantityInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
