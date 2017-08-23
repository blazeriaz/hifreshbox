<?php
namespace Freshbox\Menus\Api\Data;

interface MenuInterface 
{
    const MENU_ID  = 'menu_id';
    const MENU_PRODUCT_ID = 'product_id';
    const MENU_WEEK_NO = 'week_no';
    const MENU_WEEK_YEAR = 'week_year';
    const MENU_RECIPE_ID = 'recipe_id';
    const MENU_TYPE = 'menu_type';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $menuId
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setId($menuId);

    /**
     * get Menu Entity 'menu_id' property value
     * @return int|null
     */
    public function getMenuId();

    /**
     * set Menu entity 'menu_id' property value
     * @param int $menuId
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setMenuId($menuId);
    
    /**
     * get Menu product_id 'product_id' property value
     * @return int|null
     */
    public function getProductId();

    /**
     * set Menu product_id entity 'product_id' property value
     * @param int $product_id
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setProductId($product_id);
	
	/**
     * get Menu entity 'week_no' property value
     * @return int|null
     */
    public function getWeekNo();

    /**
     * set Menu entity 'week_no' property value
     * @param int $week_no
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setWeekNo($week_no);
	
	
	/**
     * get Menu 'week_year' property value
     * @return int|null
     */
    public function getWeekYear();

    /**
     * set Menu 'week_year' property value
     * @param int $week_year
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setWeekYear($week_year);
	
	/**
     * get Menu 'recipe_id' property value
     * @return int|null
     */
    public function getRecipeId();

    /**
     * set Menu 'recipe_id' property value
     * @param int $recipe_id
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setRecipeId($recipe_id);
	
	/**
     * get Menu 'menu_type' property value
     * @return string|null
     */
    public function getMenuType();

    /**
     * set Menu 'menu_type' property value
     * @param string $menu_type
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setMenuType($menu_type);
	
}
