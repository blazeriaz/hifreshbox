<?php
namespace Freshbox\Meals\Model\ResourceModel\Subscribemealpreference;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Meals\Model\Subscribemealpreference','Freshbox\Meals\Model\ResourceModel\Subscribemealpreference');
    }
}
