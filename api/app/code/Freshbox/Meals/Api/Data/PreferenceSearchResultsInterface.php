<?php
namespace Freshbox\Meals\Api\Data;

interface PreferenceSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Meals\Api\Data\PreferenceInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Meals\Api\Data\PreferenceInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
