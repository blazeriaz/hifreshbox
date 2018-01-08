<?php
namespace Freshbox\Faqs\Model\ResourceModel;
class Faq extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        
        $this->_init('freshbox_faq','faq_id');
    }
}
