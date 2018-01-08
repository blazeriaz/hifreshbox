<?php
namespace Freshbox\Subscription\Model\ResourceModel;
class Primarycard extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        
        $this->_init('braintree_default_card','primary_card_id');
    }
}
