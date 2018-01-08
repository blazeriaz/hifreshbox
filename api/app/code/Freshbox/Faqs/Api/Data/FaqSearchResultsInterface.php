<?php
namespace Freshbox\Faqs\Api\Data;

interface FaqSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Freshbox\Faqs\Api\Data\FaqInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Freshbox\Faqs\Api\Data\FaqInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
