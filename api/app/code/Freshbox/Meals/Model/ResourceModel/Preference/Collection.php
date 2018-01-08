<?php
namespace Freshbox\Meals\Model\ResourceModel\Preference;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Meals\Model\Preference','Freshbox\Meals\Model\ResourceModel\Preference');
    }
}
