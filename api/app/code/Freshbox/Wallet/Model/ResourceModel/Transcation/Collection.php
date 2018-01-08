<?php
namespace Freshbox\Wallet\Model\ResourceModel\Transcation;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Wallet\Model\Transcation','Freshbox\Wallet\Model\ResourceModel\Transcation');
    }
}
