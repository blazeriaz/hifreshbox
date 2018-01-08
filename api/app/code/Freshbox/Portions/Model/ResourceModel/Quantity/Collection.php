<?php
namespace Freshbox\Portions\Model\ResourceModel\Quantity;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Portions\Model\Quantity','Freshbox\Portions\Model\ResourceModel\Quantity');
    }
}
