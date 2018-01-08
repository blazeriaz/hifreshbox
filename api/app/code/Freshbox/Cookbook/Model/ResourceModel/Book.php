<?php
namespace Freshbox\Cookbook\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;
use Magento\Store\Model\Store;
use Magento\Framework\Model\AbstractModel;
use Magento\Framework\Exception\LocalizedException;

class Book extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('cookbook','cookbook_id');
    }
	protected function _beforeSave(AbstractModel $object){
		
		 if (!$this->checkIsUniqueCookbook($object)) {
            throw new LocalizedException(
                __('Cookbook name cannot be same.')
            );
        }

        return parent::_beforeSave($object);
	}
	
	public function checkIsUniqueCookbook(AbstractModel $object)
    {
        

        $select = $this->getConnection()->select()
            ->from(['book' => $this->getMainTable()])
            ->where('book.title = ?', $object->getData('title'))
            ->where('book.user_id = ?', $object->getData('user_id'));
            

        if ($object->getId()) {
            $select->where('book.cookbook_id <> ?', $object->getId());
        }

        if ($this->getConnection()->fetchRow($select)) {
            return false;
        }

        return true;
    }

}
