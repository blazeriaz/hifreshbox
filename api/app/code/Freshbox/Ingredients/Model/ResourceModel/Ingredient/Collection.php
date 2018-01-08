<?php
namespace Freshbox\Ingredients\Model\ResourceModel\Ingredient;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Ingredients\Model\Ingredient','Freshbox\Ingredients\Model\ResourceModel\Ingredient');
    }
}
