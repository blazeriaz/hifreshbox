<?php
namespace Freshbox\Recipes\Model\ResourceModel;
class Recipe extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('recipes','recipe_id');
    }
}
