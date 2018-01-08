<?php
namespace Freshbox\Cookbook\Model\ResourceModel\Book;
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Freshbox\Cookbook\Model\Book','Freshbox\Cookbook\Model\ResourceModel\Book');
    }
}
