<?php
namespace Freshbox\Wallet\Api\Data;

interface RecordSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Wallet\Api\Data\RecordInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Wallet\Api\Data\RecordInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
