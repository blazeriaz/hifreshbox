<?php
namespace  Freshbox\Menus\Api\Data;

interface MenuSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get Menu list
     *
     * @return \Freshbox\Menus\Api\Data\MenuInterface[]
     */
    public function getItems();

    /*
     * set Menu list
     *
     * @param \Freshbox\Menus\Api\Data\MenuInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
