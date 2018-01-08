<?php
namespace Freshbox\Wallet\Model\ResourceModel;
class Transcation extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('wallet_transcation','id');
    }
}
