<?php
namespace Freshbox\Menus\Model\ResourceModel;
class Menu extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
       
        $this->_init('menus','menu_id');
    }
}
