<?php
namespace Freshbox\Subscription\Model\ResourceModel;
class Pause extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        
        $this->_init('subscription_pause','pause_id');
    }
}
