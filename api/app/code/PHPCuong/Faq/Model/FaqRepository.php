<?php
namespace PHPCuong\Faq\Model;



use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Api\DataObjectHelper;
use Magento\Framework\Reflection\DataObjectProcessor;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Api\SearchResultsInterfaceFactory;
use Magento\Framework\App\ResourceConnectionFactory;
use PHPCuong\Faq\Model\ResourceModel\Faq as FaqResourceModel;

/**
 * @api
 */
class FaqRepository implements \PHPCuong\Faq\Api\FaqRepositoryInterface
{
   /**
     * @var ResourceConnectionFactory
     */
    protected $_resourceConnection;
	
	protected $faqFactory;
	
	 /**
     * @var \PHPCuong\Faq\Model\ResourceModel\Faq
     */
    protected $_faqResourceModel;

    /**
     * @var \Freshbox\Faqs\Model\ResourceModel\Faq\CollectionFactory
     */
    protected $faqCollectionFactory;
	
	 
	
	public function __construct(ResourceConnectionFactory $_resourceConnection,
								\PHPCuong\Faq\Model\Faq $faqFactory,
                                \Freshbox\Faqs\Model\ResourceModel\Faq\CollectionFactory $faqCollectionFactory,
								FaqResourceModel $faqResourceModel
								
								)
    {
        $this->_resourceConnection = $_resourceConnection;
        $this->faqFactory        = $faqFactory;
         $this->_faqResourceModel = $faqResourceModel;
          $this->faqCollectionFactory    = $faqCollectionFactory;
        
    }
    
    /**
     * @return mixed
     */
    public function save($faq_data)
    {
		try{
		//$faqModel  =  $this->faqFactory->create();
		$objectManager = \Magento\Framework\App\ObjectManager::getInstance();
		$model = $objectManager->create('PHPCuong\Faq\Model\Faq');
		$model->setData($faq_data);
		 $model->save();
		}catch(Exception $e){
			echo $e->getMessage();
		}
		//$id='';
		//$model = $this->_objectManager->create('PHPCuong\Faq\Model\Faq')->load($id);
		return $faq_data;
	}
	
	public function getlist(){

          $collection = $this->faqCollectionFactory->create();
         
          $collection->getSelect()->columns(array('title'=>'question','content'=>'answer'));
          $collection->addFieldToFilter('is_active', 1);
          $collection->setOrder('sort_order','ASC');
          return $collection->getData();
		
		/*$select = $this->_faqResourceModel->getConnection()->select()
            ->from(['faq' => $this->_faqResourceModel->getMainTable()])
            ->joinLeft(
                ['faq_store' => $this->_faqResourceModel->getTable('phpcuong_faq_store')],
                'faq.faq_id = faq_store.faq_id',
                ['store_id']
            )
            ->where('faq_store.store_id =?', 1)
            ->where('faq.is_active = ?', '1');
			 $select->order('faq.sort_order ASC');
			
			$select->group('faq.faq_id');
			if ($results = $this->_faqResourceModel->getConnection()->fetchAll($select)) {
            return $results;
        }*/

        return false;
		
	}

   
	
	
}