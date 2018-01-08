<?php
namespace Freshbox\Wallet\Model\ResourceModel\Record;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Wallet\Model\Record','Freshbox\Wallet\Model\ResourceModel\Record');
    }
}
