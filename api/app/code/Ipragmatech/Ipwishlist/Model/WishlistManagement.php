<?php
/**
 * Contributor company: iPragmatech solution Pvt Ltd.
 * Contributor Author : Manish Kumar
 * Date: 23/5/16
 * Time: 11:55 AM
 */

namespace Ipragmatech\Ipwishlist\Model;

use Ipragmatech\Ipwishlist\Api\WishlistManagementInterface;
use Magento\Wishlist\Controller\WishlistProvider;
use Magento\Wishlist\Model\ResourceModel\Item\CollectionFactory;
use Magento\Wishlist\Model\WishlistFactory;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\App\Filesystem\DirectoryList;
/**
 * Defines the implementaiton class of the WishlistManagementInterface
 */
class WishlistManagement implements WishlistManagementInterface
{

    /**
     * @var CollectionFactory
     */
    protected $_wishlistCollectionFactory;

    /**
     * Wishlist item collection
     *
     * @var \Magento\Wishlist\Model\ResourceModel\Item\Collection
     */
    protected $_itemCollection;

    /**
     * @var WishlistRepository
     */
    protected $_wishlistRepository;

    /**
     * @var ProductRepository
     */
    protected $_productRepository;
    /**
     * @var WishlistFactory
     */
    protected $_wishlistFactory;
    /**
     * @var Item
     */
    protected $_itemFactory;
	
	protected $_filesystem;
	
	protected $_imageFactory;
	
	protected $_reviewFactory;
	
	/**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;


    /**
     * @param CollectionFactory $wishlistCollectionFactory
     * @param \Magento\Catalog\Model\ProductFactory $productFactory
     * @param \Magento\Framework\Math\Random $mathRandom
     * @param \Magento\Framework\Stdlib\DateTime $dateTime
     * @param ProductRepositoryInterface $productRepository
     */
    public function __construct(
        CollectionFactory $wishlistCollectionFactory,
        WishlistFactory $wishlistFactory,
        \Magento\Wishlist\Model\WishlistFactory $wishlistRepository,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \Magento\Wishlist\Model\ItemFactory $itemFactory,
		\Magento\Catalog\Model\ProductFactory $productFactory,
		\Magento\Framework\Filesystem $filesystem,
		\Magento\Framework\Image\AdapterFactory $imageFactory,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
		\Magento\Review\Model\ReviewFactory $reviewFactory
    ) {
        $this->_wishlistCollectionFactory = $wishlistCollectionFactory;
        $this->_wishlistRepository = $wishlistRepository;
        $this->_productRepository = $productRepository;
        $this->_wishlistFactory = $wishlistFactory;
        $this->_itemFactory = $itemFactory;
		$this->productFactory = $productFactory;
		$this->_filesystem = $filesystem;
		 $this->_directory = $filesystem->getDirectoryWrite(DirectoryList::MEDIA);
		 $this->_imageFactory = $imageFactory;
		  $this->storeManager = $storeManager;
		  $this->_reviewFactory = $reviewFactory;
    }

    /**
     * Get wishlist collection
     * @deprecated
     * @param $customerId
     * @return WishlistData
     */
    public function getWishlistForCustomer($customerId)
    {

        if (empty($customerId) || !isset($customerId) || $customerId == "") {
            throw new InputException(__('Id required'));
        } else {
            $collection =
                $this->_wishlistCollectionFactory->create()
                    ->addCustomerIdFilter($customerId);
            
            $wishlistData = [];
            foreach ($collection as $item) {
				$productInfo = $item->getProduct()->toArray();
				$product = $this->productFactory->create();
				$product_res = $product->loadByAttribute('sku', $productInfo['sku']);
				if($product_res){

				$recipe_detail = $product_res->getData();

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
                $data = [
                    "wishlist_item_id" => $item->getWishlistItemId(),
                    "wishlist_id"      => $item->getWishlistId(),
                    "product_id"       => $item->getProductId(),
                    "store_id"         => $item->getStoreId(),
                    "added_at"         => $item->getAddedAt(),
                    "description"      => $item->getDescription(),
                    "qty"              => round($item->getQty()),
                    "product"          => $recipe_detail
                ];
                $wishlistData[] = $data;
            }
            return $wishlistData;
        }
    }

    /**
     * Add wishlist item for the customer
     * @param int $customerId
     * @param int $productIdId
     * @return array|bool
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function addWishlistForCustomer($customerId, $productId)
    {
		
        if ($productId == null) {
            throw new LocalizedException(__
            ('Invalid product, Please select a valid product'));
        }
        try {
            $product = $this->_productRepository->getById($productId);
        } catch (NoSuchEntityException $e) {
            $product = null;
        }
        try {
            $wishlist = $this->_wishlistRepository->create()->loadByCustomerId
            ($customerId, true);
			
			$itemss = $wishlist->getItemCollection();
			
			if(count($itemss) > 0){
			 foreach ($itemss as $item) {
				 if ($item->getProductId() == $productId){
					 
					 $item->delete();
					 $wishlist->save();  
					 return 'removed';
				}
			 }
			}
			
            $wishlist->addNewItem($product);
           $returnData = $wishlist->save();
			 $wishlistData = [];
			if($returnData->getId()){
				//$items = $wishlist->getItemCollection();
				 foreach ($itemss as $item) {
					 if ($item->getProductId() == $productId){
						 
						 $productInfo = $item->getProduct()->toArray();
						 
						 $product = $this->productFactory->create();
				$product_res = $product->loadByAttribute('sku', $productInfo['sku']);
				if($product_res){

				$recipe_detail = $product_res->getData();

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
                $data = [
                    "wishlist_item_id" => $item->getWishlistItemId(),
                    "wishlist_id"      => $item->getWishlistId(),
                    "product_id"       => $item->getProductId(),
                    "store_id"         => $item->getStoreId(),
                    "added_at"         => $item->getAddedAt(),
                    "description"      => $item->getDescription(),
                    "qty"              => round($item->getQty()),
                    "product"          => $recipe_detail
                ];
                $wishlistData[] = $data;
						 
					 }
				 }
			}
			return $wishlistData;
			//return 'added';
			/*$items = $wishlist->getItemCollection();
			 foreach ($items as $item) {
				 if ($item->getProductId() == $productId){
					$wishlist_itemid = $item->getWishlistItemId();
					$item = $this->_itemFactory->create()->load($wishlist_itemid);
					return $item->getData();
				 }
			 }*/
			//$model->getId();
			//return $returnData->getId();
			
        } catch (NoSuchEntityException $e) {
			return $e->getMessage();
        }
       
    }

    /**
     * Delete wishlist item for customer
     * @param int $customerId
     * @param int $productIdId
     * @return bool|\Magento\Wishlist\Api\status
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function deleteWishlistForCustomer($customerId, $wishlistItemId)
    {

        if ($wishlistItemId == null) {
            throw new LocalizedException(__
            ('Invalid wishlist item, Please select a valid item'));
        }
        $item = $this->_itemFactory->create()->load($wishlistItemId);
        if (!$item->getId()) {
            throw new \Magento\Framework\Exception\NoSuchEntityException(
                __('The requested Wish List Item doesn\'t exist.')
            );
        }
        $wishlistId = $item->getWishlistId();
        $wishlist = $this->_wishlistFactory->create();

        if ($wishlistId) {
            $wishlist->load($wishlistId);
        } elseif ($customerId) {
            $wishlist->loadByCustomerId($customerId, true);
        }
        if (!$wishlist) {
            throw new \Magento\Framework\Exception\NoSuchEntityException(
                __('The requested Wish List doesn\'t exist.')
            );
        }
        if (!$wishlist->getId() || $wishlist->getCustomerId() != $customerId) {
            throw new \Magento\Framework\Exception\NoSuchEntityException(
                __('The requested Wish List doesn\'t exist.')
            );
        }
        try {
            $item->delete();
            $wishlist->save();
        } catch (\Exception $e) {

        }
        return true;
    }

    /**
     * Return count of wishlist item for customer
     * @param int $customerId
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getWishlistInfo($customerId){

        if (empty($customerId) || !isset($customerId) || $customerId == "") {
            throw new InputException(__('Id required'));
        } else {
            $collection =
                $this->_wishlistCollectionFactory->create()
                    ->addCustomerIdFilter($customerId);

            $totalItems = count($collection);

            $data = [
                "total_items"      => $totalItems
            ];

            $wishlistData[] = $data;

            return $wishlistData;
        }
    }
}