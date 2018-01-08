<?php
namespace Freshbox\Meals\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;
use Magento\Store\Model\Store;
use Magento\Framework\Model\AbstractModel;
use Magento\Framework\Exception\LocalizedException;

class Preferenceoption extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('meal_preference_option','preference_option_id');
    }
	
}
