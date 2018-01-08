<?php
namespace Freshbox\Recipes\Model\ResourceModel\Ingredient;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Recipes\Model\Ingredient','Freshbox\Recipes\Model\ResourceModel\Ingredient');
    }
}
