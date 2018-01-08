<?php
namespace Freshbox\Menus\Model\ResourceModel\Menu;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Menus\Model\Menu','Freshbox\Menus\Model\ResourceModel\Menu');
    }
}
