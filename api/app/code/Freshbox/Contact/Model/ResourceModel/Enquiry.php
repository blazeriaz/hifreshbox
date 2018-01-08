<?php
namespace Freshbox\Contact\Model\ResourceModel;
class Enquiry extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        
        $this->_init('enquiry','enquiry_id');
    }
}
