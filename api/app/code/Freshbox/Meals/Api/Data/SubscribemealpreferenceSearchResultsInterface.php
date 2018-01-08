<?php
namespace Freshbox\Meals\Api\Data;

interface SubscribemealpreferenceSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
