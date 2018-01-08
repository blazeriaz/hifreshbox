<?php
namespace Freshbox\Meals\Model\ResourceModel\Preferenceoption;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Meals\Model\Preferenceoption','Freshbox\Meals\Model\ResourceModel\Preferenceoption');
    }
}
