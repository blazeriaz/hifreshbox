<?php
namespace Freshbox\Wallet\Api\Data;

interface TranscationSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Wallet\Api\Data\TranscationInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Wallet\Api\Data\TranscationInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
