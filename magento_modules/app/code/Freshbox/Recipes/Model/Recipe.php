<?php
namespace Freshbox\Recipes\Model;
/**
 *@api
 */
class Recipe extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Recipes\Api\Data\RecipeInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_recipes_recipe';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Recipes\Model\ResourceModel\Recipe');
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
        return $this->getData(self::PROPERTY_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setId($id) {
        $this->setData(self::PROPERTY_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getRecipeId() {
        return $this->getData(self::PROPERTY_RECIPE_ID);
    }

    /**
     * @api
     * @param int $recipeId
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setSlideId($recipeId) {
        $this->setData(self::PROPERTY_RECIPE_ID, $recipeId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getTitle() {
        return $this->getData(self::PROPERTY_TITLE);
    }

    /**
     * @api
     * @param string $title
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setTitle($title) {
        $this->setData(self::PROPERTY_TITLE, $title);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getImage() {
        return $this->getData(self::PROPERTY_IMAGE);
    }

    /**
     * @api
     * @param string $image
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setImage($image) {
        $this->setData(self::PROPERTY_IMAGE, $image);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getChefName() {
        return $this->getData(self::PROPERTY_CHEF_NAME);
    }

    /**
     * @api
     * @param string $chefname
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setChefName($chefname) {
        $this->setData(self::PROPERTY_CHEF_NAME, $chefname);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getCookingTime() {
        return $this->getData(self::PROPERTY_COOKING_TIME);
    }

    /**
     * @api
     * @param string $cooking_time
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setCookingTime($cooking_time) {
        $this->setData(self::PROPERTY_COOKING_TIME, $cooking_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getServings() {
        return $this->getData(self::PROPERTY_SERVINGS);
    }

    /**
     * @api
     * @param string $servings
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setServings($servings) {
        $this->setData(self::PROPERTY_SERVINGS, $servings);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getDescription() {
        return $this->getData(self::PROPERTY_DESCRIPTION);
    }

    /**
     * @api
     * @param string $description
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setDescription($description) {
        $this->setData(self::PROPERTY_DESCRIPTION, $description);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getPdfAttachment() {
        return $this->getData(self::PROPERTY_PDF_ATTACHMENT);
    }

    /**
     * @api
     * @param string $pdfattachment
     * @return \Freshbox\Recipes\Model\Recipe 
     */
    public function setPdfAttachment($pdfattachment) {
        $this->setData(self::PROPERTY_PDF_ATTACHMENT, $pdfattachment);
    }
}
