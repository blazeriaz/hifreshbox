<?php
namespace Freshbox\Menus\Api\Data;

interface MenuInterface 
{
    const MENU_ID  = 'menu_id';
    const MENU_PRODUCT_SKU = 'product_sku';
    const MENU_WEEK_NO = 'week_no';
    const MENU_WEEK_YEAR = 'week_year';
    const MENU_RECIPE_SKU = 'recipe_sku';
    const MENU_TYPE = 'menu_type';
    const SORT_ORDER = 'sort_order';
   

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
     * @api 
     * @return int|null
     */
    public function getSortOrder();

    /**
     * @api 
     *
     * @param int $sort_order
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setSortOrder($sort_order);

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
     * get Menu product_sku 'product_sku' property value
     * @return string
     */
    public function getProductSku();

    /**
     * set Menu product_sku entity 'product_sku' property value
     * @param string $product_sku
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setProductSku($product_sku);
	
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
     * get Menu 'recipe_sku' property value
     * @return int|null
     */
    public function getRecipeSku();

    /**
     * set Menu 'recipe_sku' property value
     * @param int $recipe_sku
     * @return \Freshbox\Menus\Model\Menu 
     */
    public function setRecipeSku($recipe_sku);
	
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
