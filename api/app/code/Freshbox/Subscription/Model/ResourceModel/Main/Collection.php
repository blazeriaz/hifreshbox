<?php
namespace Freshbox\Subscription\Model\ResourceModel\Main;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Subscription\Model\Main','Freshbox\Subscription\Model\ResourceModel\Main');
    }
}
