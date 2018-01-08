<?php
namespace Freshbox\Wallet\Model\ResourceModel;
class Record extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('wallet_record','id');
    }
}
