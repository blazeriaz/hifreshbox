<?php
namespace Freshbox\Subscription\Api\Data;

interface PauseSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Subscription\Api\Data\PauseInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Subscription\Api\Data\PauseInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
