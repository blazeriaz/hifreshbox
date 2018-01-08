<?php
namespace Freshbox\Cookbook\Model;

//use Freshbox\Cookbook\Api\BookRepositoryInterface;
//use Freshbox\Cookbook\Model\BookInterface;
//use Freshbox\Cookbook\Model\BookFactory;
//use Freshbox\Cookbook\Model\ResourceModel\Book\CollectionFactory;

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
class BookRepository implements \Freshbox\Cookbook\Api\BookRepositoryInterface
{
    /**
     * @var \Freshbox\Cookbook\Model\ResourceModel\Book
     */
    protected $resource;

    /**
     * @var \Freshbox\Cookbook\Model\BookFactory
     */
    protected $bookFactory;

    /**
     * @var \Freshbox\Cookbook\Model\ResourceModel\Book\CollectionFactory
     */
    protected $bookCollectionFactory;

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
     * @var \Freshbox\Cookbook\Api\Data\BookInterfaceFactory
     */
    protected $dataBookFactory;

    /**
     * @param ResourceModel\Book $resource;
     * @param BookFactory $bookFactory
     * @param ResourceModel\Book\CollectionFactory $bookCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Cookbook\Api\Data\BookInterfaceFactory $dataBookFactory
     */
    public function __construct(
        \Freshbox\Cookbook\Model\ResourceModel\Book $resource,
		\Freshbox\Cookbook\Model\BookFactory  $bookFactory,
        \Freshbox\Cookbook\Model\ResourceModel\Book\CollectionFactory $bookCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Cookbook\Api\Data\BookInterfaceFactory $dataBookFactory,
		\Freshbox\Cookbook\Model\ResourceModel\Bookrecipe\CollectionFactory $bookrecipeCollectionFactory,
		\Magento\Catalog\Model\ProductFactory $productFactory,
		\Magento\Framework\Filesystem $filesystem,
		\Magento\Framework\Image\AdapterFactory $imageFactory,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
		\Magento\Review\Model\ReviewFactory $reviewFactory
    )
    {
        $this->resource = $resource;
        $this->bookFactory        = $bookFactory;
        $this->bookCollectionFactory    = $bookCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataBookFactory = $dataBookFactory;
		$this->bookrecipeCollectionFactory    = $bookrecipeCollectionFactory;
		$this->productFactory = $productFactory;
		$this->_filesystem = $filesystem;
		 $this->_directory = $filesystem->getDirectoryWrite(DirectoryList::MEDIA);
		 $this->_imageFactory = $imageFactory;
		  $this->storeManager = $storeManager;
		  $this->_reviewFactory = $reviewFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Cookbook\Api\Data\BookInterface $cookbook
     * @return \Freshbox\Cookbook\Api\Data\BookInterface 
     */
    public function save(\Freshbox\Cookbook\Api\Data\BookInterface $cookbook)
    {
        try
        {
			
            $this->resource->save($cookbook);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $cookbook;
    }

    /**
     * @api
     * @param int $cookbookId
     * @return \Freshbox\Cookbook\Api\Data\BookInterface
     */
    public function getById($cookbookId)
    {
        $cookbook = $this->bookFactory->create();

        $this->resource->load($cookbook, $cookbookId);

        if (!$cookbook->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $cookbookId));
        }
        return $cookbook;        
    }       

    /**
     * @api
     * @param \Freshbox\Cookbook\Api\Data\BookInterface $cookbook
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Cookbook\Api\Data\BookInterface $cookbook)
    {
        try {
            $this->resource->delete($cookbook);
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
        $collection = $this->bookCollectionFactory->create();

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
        $cookbooks = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
		$i = 0;
        foreach($collection as $slideModel) {
            $cookbookData = $this->dataBookFactory->create();
            $this->dataObjectHelper->populateWithArray($cookbookData, $slideModel->getData(), '\Freshbox\Cookbook\Api\Data\BookInterface');
            $cookbooks[$i] = $this->dataObjectProcessor->buildOutputDataArray($cookbookData, '\Freshbox\Cookbook\Api\Data\BookInterface');
			$slideModel->getId();
			/*------------------------------*/
			
			$collection = $this->bookrecipeCollectionFactory->create();
			
		$collection->addFieldToFilter('cookbook_id', $slideModel->getId());
		$collection->setPageSize(4);
		$collection->setOrder('id','desc');
		
		$cook_recipie_products = [];
		
		if ($collection->getSize() > 0) {
			$product = $this->productFactory->create();
				foreach($collection as $cookbook_recipies){
				
				$sku = $cookbook_recipies->getRecipeId();
					
				$product_res = $product->loadByAttribute('sku', $sku);
				$recipe_detail = [];
				if($product_res){
				
				$recipe_detail = $product_res->getData();
				$recipe_detail['cookbook_recipe_id'] = $cookbook_recipies->getId();

				$this->_reviewFactory->create()->getEntitySummary($product_res, $this->storeManager->getStore()->getId());
				$recipe_detail['rating_summary'] = $product_res->getRatingSummary()->getRatingSummary();

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

				}else{
				$recipe_detail ='';
				}
				if($recipe_detail){
					$cook_recipie_products[] = $recipe_detail;
				}
				}
		}
			/*------------------------------*/
			
			
			$cookbooks[$i]['recipe'] = $cook_recipie_products;
			//$cookbooks[$i]['recipe_orig'] = $collection->getData();
			
			
			$i++;
        }

        $this->searchResultsFactory->setItems($cookbooks);
        return $this->searchResultsFactory;

    }
	
	
}