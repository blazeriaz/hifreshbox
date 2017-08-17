<?php
namespace Freshbox\Recipes\Model\ResourceModel;
class Ingredient extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('ingredients','ingredient_id');
    }
}
