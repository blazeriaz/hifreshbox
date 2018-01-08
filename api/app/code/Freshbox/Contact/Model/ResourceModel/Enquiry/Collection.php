<?php
namespace Freshbox\Contact\Model\ResourceModel\Enquiry;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Contact\Model\Enquiry','Freshbox\Contact\Model\ResourceModel\Enquiry');
    }
}
