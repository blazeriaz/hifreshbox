<?php
namespace Freshbox\Subscription\Api\Data;

interface MainSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Subscription\Api\Data\MainInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Subscription\Api\Data\MainInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
