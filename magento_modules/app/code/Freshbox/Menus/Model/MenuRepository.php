<?php
namespace Freshbox\Menus\Model;

//use Freshbox\Menus\Api\MenuRepositoryInterface;
//use Freshbox\Menus\Model\MenuInterface;
//use Freshbox\Menus\Model\MenuFactory;
//use Freshbox\Menus\Model\ResourceModel\Menu\CollectionFactory;

use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Api\DataObjectHelper;
use Magento\Framework\Reflection\DataObjectProcessor;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Api\SearchResultsInterfaceFactory;

/**
 * @api
 */
class MenuRepository implements \Freshbox\Menus\Api\MenuRepositoryInterface
{
    /**
     * @var \Freshbox\Menus\Model\ResourceModel\Menu
     */
    protected $resource;

    /**
     * @var \Freshbox\Menus\Model\MenuFactory
     */
    protected $menuFactory;

    /**
     * @var \Freshbox\Menus\Model\ResourceModel\Menu\CollectionFactory
     */
    protected $menuCollectionFactory;

    /**
     * @var \Magento\Framework\Api\SearchResultsInterface
     */
    protected $searchResultsFactory;

    /**
     * @var \Magento\Framework\Api\DataObjectHelper
     */
    protected $dataObjectHelper;

    /**
     * @var \Magento\Framework\Reflection\DataObjectProcessor
     */
    protected $dataObjectProcessor;

    /**
     * @var \Freshbox\Menus\Api\Data\MenuInterfaceFactory
     */
    protected $dataMenuFactory;

    /**
     * @param ResourceModel\Menu $resource;
     * @param MenuFactory $menuFactory
     * @param ResourceModel\Menu\CollectionFactory $menuCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Menus\Api\Data\MenuInterfaceFactory $dataMenuFactory
     */
    public function __construct(
        \Freshbox\Menus\Model\ResourceModel\Menu $resource,
		\Freshbox\Menus\Model\MenuFactory  $menuFactory,
        \Freshbox\Menus\Model\ResourceModel\Menu\CollectionFactory $menuCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Menus\Api\Data\MenuInterfaceFactory $dataMenuFactory
    )
    {
        $this->resource = $resource;
        $this->menuFactory        = $menuFactory;
        $this->menuCollectionFactory    = $menuCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataMenuFactory = $dataMenuFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Menus\Api\Data\MenuInterface $menu
     * @return \Freshbox\Menus\Api\Data\MenuInterface 
     */
    public function save(\Freshbox\Menus\Api\Data\MenuInterface $menu)
    {
        try
        {
			
            $this->resource->save($menu);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $menu;
    }
	
	/**
     * 
     * @return mixed 
     */
    public function customSave($menu)
    {
        $menu_result = array(); 
		
		 foreach($menu as $menu_data){
			 $model = $this->menuFactory->create();
			$model->setProductId($menu_data['product_id']);
			$model->setWeekNo($menu_data['week_no']);
			$model->setWeekYear($menu_data['week_year']);
			$model->setRecipeId($menu_data['recipe_id']);
			$model->setMenuType($menu_data['menu_type']);
			$model->save();
			$menu_result[] = $model->getData();
		 }
		return $menu_result;
    }

    /**
     * @api
     * @param int $menuId
     * @return \Freshbox\Menus\Api\Data\MenuInterface
     */
    public function getById($menuId)
    {
        $menu = $this->menuFactory->create();

        $this->resource->load($menu, $menuId);

        if (!$menu->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $recipeId));
        }
        return $menu;        
    }       

    /**
     * @api
     * @param \Freshbox\Menus\Api\Data\MenuInterface $menu
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Menus\Api\Data\MenuInterface $menu)
    {
        try {
            $this->resource->delete($menu);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__($exception->getMessage()));
        }
        return true;    
    }    

    /**
     * @api
     * @param int $id
     * return bool true on success
     */
    public function deleteById($id)
    {
        return $this->delete($this->getById($id));
    }    

    /**
     * @api
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        //echo get_class($this->searchResultsFactory). "\n\n";
        $searchResults = $this->searchResultsFactory; //->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->menuCollectionFactory->create();

        foreach ($searchCriteria->getFilterGroups() as $filterGroup) {
            $fields = [];
            $conditions = [];
            foreach ($filterGroup->getFilters() as $filter) {
                $condition = $filter->getConditionType() ? $filter->getConditionType() : 'eq';
                $fields[] = $filter->getField();
                $conditions[] = [$condition => $filter->getValue()];
            }
            if ($fields) {
                $collection->addFieldToFilter($fields, $conditions);
            }
        }

        $searchResults->setTotalCount($collection->getSize());
        $sortOrders = $searchCriteria->getSortOrders();
        if ($sortOrders) {
            /** @var SortOrder $sortOrder */
            foreach ($sortOrders as $sortOrder) {
                $collection->addOrder(
                    $sortOrder->getField(),
                    ($sortOrder->getDirection() == SortOrder::SORT_ASC) ? 'ASC' : 'DESC'
                );
            }
        }
        $collection->setCurPage($searchCriteria->getCurrentPage());
        $collection->setPageSize($searchCriteria->getPageSize());
        $menus = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $menuData = $this->dataMenuFactory->create();
            $this->dataObjectHelper->populateWithArray($menuData, $slideModel->getData(), '\Freshbox\Menus\Api\Data\MenuInterface');
            $menus[] = $this->dataObjectProcessor->buildOutputDataArray($menuData, '\Freshbox\Menus\Api\Data\MenuInterface');
        }

        $this->searchResultsFactory->setItems($menus);
        return $this->searchResultsFactory;

    }
}