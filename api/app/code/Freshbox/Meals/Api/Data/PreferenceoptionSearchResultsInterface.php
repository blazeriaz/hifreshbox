<?php
namespace Freshbox\Meals\Api\Data;

interface PreferenceoptionSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Meals\Api\Data\PreferenceoptionInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Meals\Api\Data\PreferenceoptionInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
