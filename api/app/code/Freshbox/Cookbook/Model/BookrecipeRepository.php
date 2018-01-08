<?php
namespace Freshbox\Cookbook\Model;


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
class BookrecipeRepository implements \Freshbox\Cookbook\Api\BookrecipeRepositoryInterface
{
    /**
     * @var \Freshbox\Cookbook\Model\ResourceModel\Bookrecipe
     */
    protected $resource;

    /**
     * @var \Freshbox\Cookbook\Model\BookrecipeFactory
     */
    protected $bookrecipeFactory;

    /**
     * @var \Freshbox\Cookbook\Model\ResourceModel\Bookrecipe\CollectionFactory
     */
    protected $bookrecipeCollectionFactory;

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
     * @var \Freshbox\Cookbook\Api\Data\BookrecipeInterfaceFactory
     */
    protected $dataBookrecipeFactory;
	
	protected $_filesystem;
	
	protected $_imageFactory;
	
	protected $_reviewFactory;
	
	/**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @param ResourceModel\Bookrecipe $resource;
     * @param BookrecipeFactory $bookrecipeFactory
     * @param ResourceModel\Bookrecipe\CollectionFactory $bookrecipeCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Cookbook\Api\Data\BookrecipeInterfaceFactory $dataBookrecipeFactory
     */
    public function __construct(
        \Freshbox\Cookbook\Model\ResourceModel\Bookrecipe $resource,
		\Freshbox\Cookbook\Model\BookrecipeFactory  $bookrecipeFactory,
        \Freshbox\Cookbook\Model\ResourceModel\Bookrecipe\CollectionFactory $bookrecipeCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Cookbook\Api\Data\BookrecipeInterfaceFactory $dataBookrecipeFactory,
		\Magento\Catalog\Model\Product $product,
		\Magento\Catalog\Model\ProductFactory $productFactory,
		\Magento\Framework\Filesystem $filesystem,
		\Magento\Framework\Image\AdapterFactory $imageFactory,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
		\Magento\Review\Model\ReviewFactory $reviewFactory,
		 \Magento\Quote\Model\QuoteFactory $quote,
		 \Magento\Quote\Model\QuoteRepository $quoteRepository,
		 \Freshbox\Meals\Model\SubscribemealpreferenceFactory  $subscribemealpreferenceFactory,
		\Freshbox\Meals\Model\ResourceModel\Subscribemealpreference\CollectionFactory $subscribemealpreferenceCollectionFactory,
        \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository,
		\Freshbox\Meals\Model\PreferenceoptionFactory  $preferenceoptionFactory,
		 \Magento\Framework\Stdlib\DateTime\DateTime $date,
		 \Magento\Framework\Registry $registry
		
    )
    {
        $this->resource = $resource;
        $this->bookrecipeFactory        = $bookrecipeFactory;
        $this->bookrecipeCollectionFactory    = $bookrecipeCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataBookrecipeFactory = $dataBookrecipeFactory;
		 $this->preferenceoptionFactory        = $preferenceoptionFactory;
		  $this->quoteRepository = $quoteRepository;
        $this->product = $product;
		$this->productFactory = $productFactory;
		$this->_filesystem = $filesystem;
		 $this->_directory = $filesystem->getDirectoryWrite(DirectoryList::MEDIA);
		 $this->_imageFactory = $imageFactory;
		  $this->storeManager = $storeManager;
		  $this->_reviewFactory = $reviewFactory;
		   $this->quote = $quote;
		    $this->subscribemealpreferenceFactory        = $subscribemealpreferenceFactory;
		  $this->subscribemealpreferenceCollectionFactory    = $subscribemealpreferenceCollectionFactory; 
        $this->customerRepository = $customerRepository;
		 $this->_registry = $registry;
		  $this->date = $date;
    }
    
    /**
     * @api
     * @param \Freshbox\Cookbook\Api\Data\BookrecipeInterface $cookbook_recipe
     * @return \Freshbox\Cookbook\Api\Data\BookrecipeInterface 
     */
    public function save(\Freshbox\Cookbook\Api\Data\BookrecipeInterface $cookbook_recipe)
    {
        try
        {
			
            $this->resource->save($cookbook_recipe);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $cookbook_recipe;
    }
	
	public function getItemModel(){
    $objectManager = \Magento\Framework\App\ObjectManager::getInstance();//instance of object manager
    $itemModel = $objectManager->create('Magento\Quote\Model\Quote\Item');//Quote item model to load quote item
    return $itemModel;
}

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Cookbook\Api\Data\BookrecipeInterface
     */
    public function getById($id)
    {
        $cookbook = $this->bookrecipeFactory->create();

        $this->resource->load($cookbook, $id);

        if (!$cookbook->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $id));
        }
        return $cookbook;        
    }       

    /**
     * @api
     * @param \Freshbox\Cookbook\Api\Data\BookrecipeInterface $cookbook_recipe
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Cookbook\Api\Data\BookrecipeInterface $cookbook_recipe)
    {
        try {
            $this->resource->delete($cookbook_recipe);
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
     * Return Added wishlist info.
     *
     * @param int $customerId
     * @param mixed $cart_item
     * @return array
     *
     */
	public function addtocartrecipe($customerId,$cart_item){
		try {
			 $cquote = $this->quoteRepository->get($cart_item['quote_id']);
             $items = $cquote->getAllItems();
			 foreach($items as $itm){
				
				 if($itm->getSku() == 'freshbox-subscription'){
					
					$quoteItem=$this->getItemModel()->load($itm->getId());//load particular item which you want to delete by his item id
					$quoteItem->delete();//deletes the item
				 }
			 }
          
		$store=$this->storeManager->getStore();
		$websiteId = $this->storeManager->getStore()->getWebsiteId();
		$quote= $this->quote->create()->load($cart_item['quote_id']);
		$quote->setStore($store); 
		$customer= $this->customerRepository->getById($customerId);
        $quote->setCurrency();
        $quote->assignCustomer($customer); //Assign quote to customer
		
		// meal preferences
		$custom_price = 0;
			$option_text = '';
		if($cart_item['preferences']){		
			
			foreach($cart_item['preferences'] as $key => $preferences){
				
				$preferenceopt = $this->preferenceoptionFactory->create();
				
				$preference_opt = $preferenceopt->load($preferences['option_id']);
				 
				 $price = floatval($preference_opt->getPrice());
				 
				$option_text .= $preference_opt->getTitle().' * '.$preferences['qty'].',';
				 
				$qty_price  = $price * $preferences['qty'];
				
				$custom_price = $custom_price + $qty_price;
				
				
			}
			$option_text = rtrim($option_text,',');
			} 
			
			$product = $this->product->load($cart_item['product_id']);
			$_objectManager = \Magento\Framework\App\ObjectManager::getInstance();
			$customOptions = $_objectManager->get('Magento\Catalog\Model\Product\Option')->getProductOptionCollection($product);
			
			$custom_options = $customOptions->getData();
			
				
			
			
			$current_price = $product->getPrice() + $custom_price;
            $product->setPrice($current_price);
            $product->setCustomPrice($current_price);
		
			$product->setOriginalCustomPrice($current_price);
			
			$this->_registry->register('custom_price', $current_price);
			
			$params = array('product' => $cart_item['product_id'], 'qty' => $cart_item['qty']);
			
			$date = $this->date->gmtDate();
			//$week_no = 21;
			$week_no = $date;
			
			if($cart_item['howmuch_meals_week']){ $howmuch_meals_week = $cart_item['howmuch_meals_week'];}else{ $howmuch_meals_week = '';}
			if($cart_item['howmany_people']){$howmany_people = $cart_item['howmany_people'];}else{ $howmany_people = '';}
			if($cart_item['meal_extra_notes']){$meal_extra_notes = $cart_item['meal_extra_notes'];}else{ $meal_extra_notes = '';}
			
			$week_no_id = $this->customoptionid('Week No',$custom_options);
			$option_text_id = $this->customoptionid('Meal Preference',$custom_options);
			$howmuch_meals_week_id = $this->customoptionid('how much meals week',$custom_options);
			$howmany_people_id = $this->customoptionid('how many people',$custom_options);
			$meal_extra_notes_id = $this->customoptionid('meal extra notes',$custom_options);
			
			$params['options'] = array($week_no_id=>$week_no,$option_text_id=>$option_text,$howmuch_meals_week_id=>$howmuch_meals_week,$howmany_people_id=>$howmany_people,$meal_extra_notes_id=>$meal_extra_notes);
			
			$objParam = new \Magento\Framework\DataObject();
			
			$objParam->setData($params);
			
			$quote->addProduct($product,$objParam);
			
			$quote->save();
			$quote->collectTotals()->save();
			
			// saving user preference
			
			$collection = $this->subscribemealpreferenceCollectionFactory->create();
			
			$collection->addFieldToFilter('user_id', $customerId);
		
			$user_preference = $collection->getData();
			
			if(count($user_preference) == 1){
					$preferences = json_encode($cart_item['preferences']);
					$model = $this->subscribemealpreferenceFactory->create()->load($user_preference[0]['id']);
					$model->setData('meal_preference_setting',$preferences);
					$model->setData('howmuch_meals_week', $howmuch_meals_week);
					$model->setData('howmany_people', $howmany_people);
					$model->setData('meal_extra_notes', $meal_extra_notes);
					$model->save();
				
			}else if(count($user_preference) == 0){
				$preferences = json_encode($cart_item['preferences']);
				$model = $this->subscribemealpreferenceFactory->create();
				$model->setData('user_id',$customerId);
				$model->setData('meal_preference_setting',$preferences);
				$model->setData('howmuch_meals_week', $howmuch_meals_week);
				$model->setData('howmany_people', $howmany_people);
				$model->setData('meal_extra_notes', $meal_extra_notes);
				$model->save();
			}
			
			
       } catch (\Exception $exception) {
		   return $exception->getMessage();
	   }
		
		return 'success';
	}
	
	public function customoptionid($title,$options){
		
		foreach($options as $opt){
			if($opt['title'] == $title){
				return $opt['option_id'];
			}
		}
		return false;
	}
	
	
	/**
     * Return Added wishlist info.
     *
     * @param int $customerId
     * @param int $quoteId     
     * @return array
     *
     */
	public function guesttocustomer($customerId,$quoteId){
		 $customer= $this->customerRepository->getById($customerId);
		
		 $dquote = $this->quote->create()->loadByCustomer($customer);
		 $cquoteId = $dquote->getId();
		$cquote = $this->quoteRepository->get($quoteId);
        $items = $cquote->getAllItems();
		$store=$this->storeManager->getStore();
		$websiteId = $this->storeManager->getStore()->getWebsiteId();
		$quote= $this->quote->create()->load($cquoteId);
		$quote->setStore($store); 
		
        $quote->setCurrency();
        $quote->assignCustomer($customer); //Assign quote to customer
		$product = $this->productFactory->create();
		if(count($items) > 0){
		 foreach($items as $itm){
			
			$product_res = $product->loadByAttribute('sku', $itm->getSku());
		
			$params = array('product' => $product_res->getId(), 'qty' => $itm->getQty());
			$objParam = new \Magento\Framework\DataObject();
			
			$objParam->setData($params);
			$quote->addProduct($product_res,$objParam);
			
			$quote->save();
		 }
		
		 
		 foreach($items as $itm){
			 $quoteItem = $this->getItemModel()->load($itm->getId());//load particular item which you want to delete by his item id
			$quoteItem->delete();//deletes the item
		 }
		 }
		$quote->collectTotals()->save();
		return 'success';
	}
	
	/**
     * 
     *
     * @param int $customerId
	 * @param int $cookbookId
     * @return array
     *
     */
	public function getcookbookrecipes($customerId,$cookbookId){
		$collection = $this->bookrecipeCollectionFactory->create();
			
		$collection->addFieldToFilter('cookbook_id', $cookbookId);
		
		$cook_recipie_products = [];
		
		if ($collection->getSize() > 0) {
			$product = $this->productFactory->create();
			$product_res = [];
				foreach($collection as $cookbook_recipies){
					$sku = $cookbook_recipies->getRecipeId();
					
				$product_res = $product->loadByAttribute('sku', $sku);
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
		}else{
			$cook_recipie_products = [];
		}
		
		return $cook_recipie_products;
	}
	
	/**
     * 
     *
     * @param int $customerId
     * @param int $cartId
     * @return array
     *
     */
	public function listcartitems($customerId,$cartId){
		return $customerId.'-->'.$cartId;
	}

    
}