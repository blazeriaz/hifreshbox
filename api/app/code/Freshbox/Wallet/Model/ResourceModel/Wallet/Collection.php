<?php
namespace Freshbox\Wallet\Model\ResourceModel\Wallet;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Wallet\Model\Wallet','Freshbox\Wallet\Model\ResourceModel\Wallet');
    }
}
