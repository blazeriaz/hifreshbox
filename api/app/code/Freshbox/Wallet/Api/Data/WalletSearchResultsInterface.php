<?php
namespace Freshbox\Wallet\Api\Data;

interface WalletSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Wallet\Api\Data\WalletInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Wallet\Api\Data\WalletInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
