<?php
namespace Freshbox\Subscription\Model\ResourceModel\Primarycard;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Subscription\Model\Primarycard','Freshbox\Subscription\Model\ResourceModel\Primarycard');
    }
}
