<?php
namespace Freshbox\Cookbook\Model\ResourceModel\Bookrecipe;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Cookbook\Model\Bookrecipe','Freshbox\Cookbook\Model\ResourceModel\Bookrecipe');
    }
}
