<?php
namespace Freshbox\Menus\Model;
/**
 *@api
 */
class Menu extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Menus\Api\Data\MenuInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_menus_menu';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Menus\Model\ResourceModel\Menu');
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
        return $this->getData(self::MENU_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setId($id) {
        $this->setData(self::MENU_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getMenuId() {
        return $this->getData(self::MENU_ID);
    }

    /**
     * @api
     * @param int $menuId
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setMenuId($menuId) {
        $this->setData(self::MENU_ID, $menuId);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getProductId() {
        return $this->getData(self::MENU_PRODUCT_ID);
    }

    /**
     * @api
     * @param int $product_id
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setProductId($product_id) {
        $this->setData(self::MENU_PRODUCT_ID, $product_id);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getWeekNo() {
        return $this->getData(self::MENU_WEEK_NO);
    }

    /**
     * @api
     * @param int $week_no
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setWeekNo($week_no) {
        $this->setData(self::MENU_WEEK_NO, $week_no);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getWeekYear() {
        return $this->getData(self::MENU_WEEK_YEAR);
    }

    /**
     * @api
     * @param int $week_year
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setWeekYear($week_year) {
        $this->setData(self::MENU_WEEK_YEAR, $week_year);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getRecipeId() {
        return $this->getData(self::MENU_RECIPE_ID);
    }

    /**
     * @api
     * @param int $recipe_id
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setRecipeId($recipe_id) {
        $this->setData(self::MENU_RECIPE_ID, $recipe_id);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getMenuType() {
        return $this->getData(self::MENU_TYPE);
    }

    /**
     * @api
     * @param string $menu_type
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setMenuType($menu_type) {
        $this->setData(self::MENU_TYPE, $menu_type);
    }
	
}
