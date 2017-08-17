<?php
namespace Freshbox\Recipes\Model;
/**
 *@api
 */
class Ingredient extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Recipes\Api\Data\IngredientInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_recipes_ingredient';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Recipes\Model\ResourceModel\Ingredient');
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
     * @return \Freshbox\Recipes\Model\Ingredient 
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
     * @return \Freshbox\Recipes\Model\Recipe 
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
     * @return \Freshbox\Recipes\Model\Ingredient 
     */
    public function setTitle($title) {
        $this->setData(self::INGREDIENT_TITLE, $title);
    }
	
	
}
