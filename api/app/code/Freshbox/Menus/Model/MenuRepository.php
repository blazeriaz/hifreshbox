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
use Magento\Framework\App\Filesystem\DirectoryList;

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
     * @var \Magento\User\Model\UserFactory
     */
    protected $userFactory;

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
	
	
	protected $_filesystem;
	
	protected $_imageFactory;
	
	protected $_reviewFactory;
	
	/**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;
	
	protected $productRepository;
	
	

    /**
     * @param ResourceModel\Menu $resource;
     * @param MenuFactory $menuFactory
     * @param UserFactory $userFactory
     * @param ResourceModel\Menu\CollectionFactory $menuCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Menus\Api\Data\MenuInterfaceFactory $dataMenuFactory
	 * @param TokenProviderInterface $tokenProvider
     */
    public function __construct(
        \Freshbox\Menus\Model\ResourceModel\Menu $resource,
		\Freshbox\Menus\Model\MenuFactory  $menuFactory,
		\Magento\User\Model\UserFactory $userFactory,
        \Freshbox\Menus\Model\ResourceModel\Menu\CollectionFactory $menuCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Menus\Api\Data\MenuInterfaceFactory $dataMenuFactory,
		\Magento\Catalog\Model\ProductFactory $productFactory,		
		\Magento\Framework\Filesystem $filesystem,
		\Magento\Framework\Image\AdapterFactory $imageFactory,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
		\Magento\Review\Model\ReviewFactory $reviewFactory,
		\Freshbox\Subscription\Model\ResourceModel\Main\CollectionFactory $mainCollectionFactory,
		\Magento\Catalog\Api\ProductRepositoryInterface $productRepository
		
    )
    {
        $this->resource = $resource;
        $this->menuFactory        = $menuFactory;
        $this->userFactory        = $userFactory;
        $this->menuCollectionFactory    = $menuCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataMenuFactory = $dataMenuFactory;
		$this->productFactory = $productFactory;
		$this->_filesystem = $filesystem;
		 $this->_directory = $filesystem->getDirectoryWrite(DirectoryList::MEDIA);
		 $this->_imageFactory = $imageFactory;
		  $this->storeManager = $storeManager;
		  $this->_reviewFactory = $reviewFactory;
		  $this->productRepository = $productRepository;
		  $this->mainCollectionFactory    = $mainCollectionFactory;
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
			$menu_collection = $this->menuCollectionFactory->create();
			$menu_collection->addFieldToFilter('week_no', $menu['week_no']);
			$menu_collection->addFieldToFilter('week_year', $menu['week_year']);
			$total_menu = $menu_collection->count();
			$sort_order = $total_menu + 1;
			$menu['sort_order'] = $sort_order;
			
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
     * 
	 * @return mixed
     */
	public function getAccountDetails($id){
		
		$objectManager = \Magento\Framework\App\ObjectManager::getInstance(); // Instance of object manager
		
		$resource = $objectManager->get('Magento\Framework\App\ResourceConnection');
		$connection = $resource->getConnection();
		$tableName = $resource->getTableName('oauth_token'); //gives table name with prefix
		
		$token_id = 'a7t5g0831w7d2062uwvfnr8q20lio2xh';
		$sql = "Select * FROM " . $tableName." where token='".$token_id."'";
		$result = $connection->fetchAll($sql);
		$admin_user_id = $result[0]['admin_id'];
			
		return $model = $this->userFactory->create()->load($id)->getData();
		
	}
	
	
	 /**
     * @param mixed $menu_data
     * @return mixed
     */
    public function changeorder($menu_data){

            $menu_data_value = $this->menuFactory->create()->load($menu_data['menu_id']); 
			 
			$week_no = $menu_data_value->getWeekNo();
			$week_year = $menu_data_value->getWeekYear();

            $collection = $this->menuCollectionFactory->create();
			$collection->addFieldToFilter('week_no', $week_no);
			$collection->addFieldToFilter('week_year', $week_year);
			
            if($menu_data['new_position'] > $menu_data['old_position']){
                $operator = 'minus';
                $collection->addFieldToFilter('sort_order', array('gt' => $menu_data['old_position']));
                $collection->addFieldToFilter('sort_order', array('lteq' => $menu_data['new_position']));
            }else{
                $operator = 'plus';
                $collection->addFieldToFilter('sort_order', array('gteq' => $menu_data['new_position']));
                $collection->addFieldToFilter('sort_order', array('lt' => $menu_data['old_position']));
            }

           
            $collection->addOrder('sort_order','asc');
           // return $collection->getData();
            
            foreach($collection as $menu_coll){
                $menuid = $menu_coll->getMenuId();
                $menu = $this->menuFactory->create()->load($menuid);
                $previous_order = $menu->getSortOrder();
                if($operator == 'minus'){
                    $current_order = $previous_order -  1 ;
                }else{
                    $current_order = $previous_order + 1 ;
                }
               
                $menu->setData('sort_order',$current_order);
                $menu->save();
            }

            $menu = $this->menuFactory->create()->load($menu_data['menu_id'])->setData('sort_order',$menu_data['new_position'])->save();
            return 'success';
          // $_products->addAttributeToFilter('id', array('gt' => 5));
           
       
            
       // return $collection->getData();
    }
	
	/**
     * 
     *  
	 * @return mixed
     */
	public function getWeekList($week_data){ 
		//$this->userCollection->addFieldToFilter('email', $email)->load(false);
		//$week_data = $this->menuCollectionFactory->addFieldToFilter('week_no', 12)->load(false);
		try{
			$subscribed = '0';
			
		$httpRequestObject = new \Zend_Controller_Request_Http();
		$tokenss = $httpRequestObject->getHeader('Authorization');
		
		if($tokenss != 'Bearer null'){
		$search = 'Bearer ';
		$token = str_replace($search,'',$tokenss);
		
		$objectManager = \Magento\Framework\App\ObjectManager::getInstance(); // Instance of object manager
		
		$resource = $objectManager->get('Magento\Framework\App\ResourceConnection');
		$connection = $resource->getConnection();
		$tableName = $resource->getTableName('oauth_token'); 
		
		
		$sql = "Select * FROM " . $tableName." where token='".$token."'";
		$result = $connection->fetchAll($sql);
		$customer_id = $result[0]['customer_id'];
			if($customer_id){
				
				$collection = $this->mainCollectionFactory->create();
				$collection->addFieldToFilter('is_active', 1);
				$collection->addFieldToFilter('user_id', $customer_id);
				$collection->setOrder('sort_order','asc');
				$subscription = $collection->getSize();
				if($subscription > 0){
					$subscribed = 1;
				}else{
					$subscribed = 0;
				}
			}
		}
			
			//return $product->load($product->getId());
			$collection = $this->menuCollectionFactory->create();
			
			$collection->addFieldToFilter('week_no', $week_data['week_no']);
			$collection->addFieldToFilter('week_year', $week_data['year']);
			$collection->setOrder('sort_order','asc');
			$menu_result = array();
			if ($collection->getSize() > 0) {
			$product = $this->productFactory->create();
			foreach($collection as $weekCollection){
					$recipe_sku = $weekCollection->getRecipeSku();
					$week_no = $weekCollection->getWeekNo();
					$week_year = $weekCollection->getWeekYear();
					$product_sku = $weekCollection->getProductSku();
					$menu_id = $weekCollection->getMenuId();
					$menu_type = $weekCollection->getMenuType();
					$sort_order = $weekCollection->getSortOrder();
					
					
					$product_res = $product->loadByAttribute('sku', $recipe_sku);
					if($product_res){
						$recipe_detail = $product_res->getData();
					
					$this->_reviewFactory->create()->getEntitySummary($product_res, $this->storeManager->getStore()->getId());
					$recipe_detail['rating_summary'] = $product_res->getRatingSummary()->getRatingSummary();
					/*----------------------------------*/
					if($product_res->getImage() && $product_res->getImage() !='no_selection'){
					 $absolutePath =	$this->_filesystem->getDirectoryRead(DirectoryList::MEDIA)->getAbsolutePath().'catalog/product'.$product_res->getImage();
		
		$imageResized = $this->_filesystem->getDirectoryRead(DirectoryList::MEDIA)->getAbsolutePath('catalog/product/cache/thumbnail/350x350').$product_res->getImage();
		
		if(!file_exists($imageResized)) {
		 $imageResize = $this->_imageFactory->create();

        $imageResize->open($absolutePath);
        $imageResize->backgroundColor([255, 255, 255]);
        $imageResize->constrainOnly(TRUE);
        $imageResize->keepTransparency(TRUE);
        $imageResize->keepFrame(false);
        $imageResize->keepAspectRatio(false);

        $imageResize->resize(316,245);
        $dest = $imageResized ;
        $imageResize->save($dest);
		}
		$resizedURL= $this->storeManager->getStore()
		->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA).
		'catalog/product/cache/thumbnail/350x350'.$product_res->getImage();
		$recipe_detail['default_image'] = $resizedURL;
					}else{
						$recipe_detail['default_image'] = '';
					}
					/*----------------------------------*/
						
						
					}else{
						$recipe_detail ='';
					}
					
					//$recipe_detail = $this->productRepository->get($recipe_sku);
					$menu_result[] = array(
										'menu_id'=>$menu_id,
										'is_subscribed'=>$subscribed,
										'sort_order'=>$sort_order,
										'week_no'=>$week_no,
										'week_year'=>$week_year,
										'product_sku'=>$product_sku,
										'recipe_sku'=>$recipe_sku,
										'recipe_detail'=>$recipe_detail
										
										);
			}
			}
			
			return $menu_result;
		//$collection = $this->menuCollectionFactory->addFieldToFilter('week_no', 12)->load(false);
		}catch (\Exception $exception) {
			return $exception->getMessage();
                    
        }
		//return $week_data;
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
			$model->setProductSku($menu_data['product_sku']);
			$model->setWeekNo($menu_data['week_no']);
			$model->setWeekYear($menu_data['week_year']);
			$model->setRecipeSku($menu_data['recipe_sku']);
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
	
	/**
     * {@inheritdoc}
     */
    public function viewrecipedetail($urlKey){
		//return $urlKey;
		$httpRequestObject = new \Zend_Controller_Request_Http();
		$tokenss = $httpRequestObject->getHeader('Authorization');
		$subscribed = 0;
		if($tokenss != 'Bearer null'){
		$search = 'Bearer ';
		$token = str_replace($search,'',$tokenss);
		
		$objectManager = \Magento\Framework\App\ObjectManager::getInstance(); // Instance of object manager
		
		$resource = $objectManager->get('Magento\Framework\App\ResourceConnection');
		$connection = $resource->getConnection();
		$tableName = $resource->getTableName('oauth_token'); 
		
		
		$sql = "Select * FROM " . $tableName." where token='".$token."'";
		$result = $connection->fetchAll($sql);
		$customer_id = $result[0]['customer_id'];
			if($customer_id){
				
				$collection = $this->mainCollectionFactory->create();
				$collection->addFieldToFilter('is_active', 1);
				$collection->addFieldToFilter('user_id', $customer_id);
				$collection->setOrder('sort_order','asc');
				$subscription = $collection->getSize();
				if($subscription > 0){
					$subscribed = 1;
				}else{
					$subscribed = 0;
				}
			}
		}
		
					$product = $this->productFactory->create();
					$product_res = $product->loadByAttribute('url_key', $urlKey);
					
					
					
					
					if($product_res){
						$product_res->is_subscribed = $subscribed;
						return $product_res;
						
					}else{
						return array('status'=>'error','message'=>'The Recipe Cannot be Found');
					}
		
		
		
	}
}