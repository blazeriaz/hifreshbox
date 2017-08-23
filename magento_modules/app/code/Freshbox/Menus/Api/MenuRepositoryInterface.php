<?php
namespace Freshbox\Menus\Api;

//use Freshbox\Menus\Model\MenuInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface MenuRepositoryInterface
{
    /**
     * Save menu.
     * @param \Freshbox\Menus\Api\Data\MenuInterface $menu
     * @return \Freshbox\Menus\Api\Data\MenuInterface
     *
     */
    public function save(\Freshbox\Menus\Api\Data\MenuInterface  $menu);
	
	/**
     * Save menu.
     * @param mixed $menu
     * @return array
     *
     */
    public function customSave($menu);

    /**
     *  Slide.
     * @param int $menuId
     * @return \Freshbox\Menus\Api\Data\MenuInterface
     *
     */
    public function getById($menuId);

    /**
     * Retrive Menus matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);

    /**
     * @param Freshbox\Menus\Api\Data\MenuInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Menus\Api\Data\MenuInterface $page);

    /**
     * @param int $menuId
     * @return bool true on success
     */
    public function deleteById($menuId);
}
