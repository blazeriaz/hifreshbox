<?php
namespace Freshbox\Cookbook\Model;
/**
 *@api
 */
class Bookrecipe extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Cookbook\Api\Data\BookrecipeInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_cookbook_recipe';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Cookbook\Model\ResourceModel\Bookrecipe');
    }

    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * @api
     * @return int|null
     */
    public function getId() {
        return $this->getData(self::COOKBOOK_RECIPE_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
     */
    public function setId($id) {
        $this->setData(self::COOKBOOK_RECIPE_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getCookbookId() {
        return $this->getData(self::COOKBOOK_ID);
    }

    /**
     * @api
     * @param int $cookbookId
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
     */
    public function setCookbookId($cookbookId) {
        $this->setData(self::COOKBOOK_ID, $cookbookId);
        return $this;
    }

   
	/**
     * @api
     * @return string|null
     */
    public function getCreationTime() {
        return $this->getData(self::CREATED);
    }

    /**
     * @api
     * @param string $creation_time
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
     */
    public function setCreationTime($creation_time) {
        $this->setData(self::CREATED, $creation_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getUpdateTime() {
        return $this->getData(self::UPDATED);
    }

    /**
     * @api
     * @param string $update_time
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATED, $update_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getRecipeId() {
        return $this->getData(self::RECIPE_ID);
    }

    /**
     * @api
     * @param string $recipe_id
     * @return \Freshbox\Cookbook\Model\Bookrecipe 
     */
    public function setRecipeId($recipe_id) {
        $this->setData(self::RECIPE_ID, $recipe_id);
    }
	
		
}
