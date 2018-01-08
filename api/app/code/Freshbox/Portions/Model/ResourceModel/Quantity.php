<?php
namespace Freshbox\Portions\Model\ResourceModel;
class Quantity extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('portions','portion_id');
    }
}
