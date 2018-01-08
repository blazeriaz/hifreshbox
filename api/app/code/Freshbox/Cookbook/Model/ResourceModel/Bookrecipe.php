<?php
namespace Freshbox\Cookbook\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;
use Magento\Store\Model\Store;
use Magento\Framework\Model\AbstractModel;
use Magento\Framework\Exception\LocalizedException;

class Bookrecipe extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        // _init('$mainTable', '$idFieldName')
        $this->_init('cookbook_recipes','id');
    }
	
	protected function _beforeSave(AbstractModel $object){
		 if (!$this->checkIsUniqueCookbook($object)) {
            throw new LocalizedException(
                __('Recipe is Already Added to Cookbook.')
            );
        }

        return parent::_beforeSave($object);
	}
	
	public function checkIsUniqueCookbook(AbstractModel $object)
    {
        

        $select = $this->getConnection()->select()
            ->from(['book_recipies' => $this->getMainTable()])
            ->where('book_recipies.cookbook_id = ?', $object->getData('cookbook_id'))
            ->where('book_recipies.recipe_id = ?', $object->getData('recipe_id'));
            

       /* if ($object->getId()) {
            $select->where('book.cookbook_id <> ?', $object->getId());
        }*/

        if ($this->getConnection()->fetchRow($select)) {
            return false;
        }

        return true;
    }
	
}
