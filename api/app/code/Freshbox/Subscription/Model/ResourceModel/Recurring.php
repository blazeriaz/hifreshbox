<?php
namespace Freshbox\Subscription\Model\ResourceModel;
class Recurring extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        
        $this->_init('subscription_recurring','recurring_id');
    }
}
