<?php
namespace Freshbox\Subscription\Api\Data;

interface RecurringSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Subscription\Api\Data\RecurringInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Subscription\Api\Data\RecurringInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
