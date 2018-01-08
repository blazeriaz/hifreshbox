<?php
namespace Freshbox\Contact\Api\Data;

interface EnquirySearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Contact\Api\Data\EnquiryInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Contact\Api\Data\EnquiryInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
