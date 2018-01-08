<?php
namespace Freshbox\Recipes\Model\ResourceModel\Recipe;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Recipes\Model\Recipe','Freshbox\Recipes\Model\ResourceModel\Recipe');
    }
}
