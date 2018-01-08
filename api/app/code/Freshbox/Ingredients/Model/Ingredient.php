<?php
namespace Freshbox\Ingredients\Model;
/**
 *@api
 */
class Ingredient extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Ingredients\Api\Data\IngredientInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_ingredients_ingredient';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Ingredients\Model\ResourceModel\Ingredient');
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
        return $this->getData(self::INGREDIENT_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Ingredients\Model\Ingredient 
     */
    public function setId($id) {
        $this->setData(self::INGREDIENT_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getIngredientId() {
        return $this->getData(self::INGREDIENT_ID);
    }

    /**
     * @api
     * @param int $ingredientId
     * @return \Freshbox\Ingredients\Model\Recipe 
     */
    public function setIngredientId($ingredientId) {
        $this->setData(self::INGREDIENT_ID, $ingredientId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getTitle() {
        return $this->getData(self::INGREDIENT_TITLE);
    }

    /**
     * @api
     * @param string $title
     * @return \Freshbox\Ingredients\Model\Ingredient 
     */
    public function setTitle($title) {
        $this->setData(self::INGREDIENT_TITLE, $title);
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
     * @return \Freshbox\Ingredients\Model\Ingredient 
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
     * @return \Freshbox\Ingredients\Model\Ingredient 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATED, $update_time);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsActive() {
        return $this->getData(self::STATUS);
    }

    /**
     * @api
     * @param int $is_active
     * @return \Freshbox\Ingredients\Model\Ingredient 
     */
    public function setIsActive($is_active) {
        $this->setData(self::STATUS, $is_active);
    }
	
	
}
