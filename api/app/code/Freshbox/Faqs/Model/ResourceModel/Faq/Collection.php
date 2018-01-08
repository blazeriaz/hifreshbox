<?php
namespace Freshbox\Faqs\Model\ResourceModel\Faq;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Faqs\Model\Faq','Freshbox\Faqs\Model\ResourceModel\Faq');
    }
}
