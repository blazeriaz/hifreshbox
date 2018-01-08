<?php
namespace Freshbox\Wallet\Model\ResourceModel;
class Wallet extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('freshbox_wallet','wallet_id');
    }
}
