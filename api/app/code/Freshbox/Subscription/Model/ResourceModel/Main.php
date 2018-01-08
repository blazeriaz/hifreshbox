<?php
namespace Freshbox\Subscription\Model\ResourceModel;
class Main extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        
        $this->_init('subscription_main','subscription_id');
    }
}
