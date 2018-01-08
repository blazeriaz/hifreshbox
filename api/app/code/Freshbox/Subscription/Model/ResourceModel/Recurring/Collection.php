<?php
namespace Freshbox\Subscription\Model\ResourceModel\Recurring;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Subscription\Model\Recurring','Freshbox\Subscription\Model\ResourceModel\Recurring');
    }
}
