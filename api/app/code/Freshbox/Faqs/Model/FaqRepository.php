<?php
namespace Freshbox\Faqs\Model;



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
class FaqRepository implements \Freshbox\Faqs\Api\FaqRepositoryInterface
{
    /**
     * @var \Freshbox\Faqs\Model\ResourceModel\Faq
     */
    protected $resource;

    /**
     * @var \Freshbox\Faqs\Model\FaqFactory
     */
    protected $faqFactory;

    /**
     * @var \Freshbox\Faqs\Model\ResourceModel\Faq\CollectionFactory
     */
    protected $faqCollectionFactory;

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
     * @var \Freshbox\Faqs\Api\Data\FaqInterfaceFactory
     */
    protected $dataFaqFactory;

    /**
     * @param ResourceModel\Faq $resource;
     * @param FaqFactory $faqFactory
     * @param ResourceModel\Faq\CollectionFactory $faqCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Faqs\Api\Data\FaqInterfaceFactory $dataFaqFactory
     */
    public function __construct(
        \Freshbox\Faqs\Model\ResourceModel\Faq $resource,
		\Freshbox\Faqs\Model\FaqFactory  $faqFactory,
        \Freshbox\Faqs\Model\ResourceModel\Faq\CollectionFactory $faqCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Faqs\Api\Data\FaqInterfaceFactory $dataFaqFactory
    )
    {
        $this->resource = $resource;
        $this->faqFactory        = $faqFactory;
        $this->faqCollectionFactory    = $faqCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataFaqFactory = $dataFaqFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Faqs\Api\Data\FaqInterface $faq
     * @return \Freshbox\Faqs\Api\Data\FaqInterface 
     */
    public function save(\Freshbox\Faqs\Api\Data\FaqInterface $faq)
    {
        try
        {
			
            $this->resource->save($faq);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $faq;
    }

    /**
     * @param mixed $faq_data
     * @return mixed
     */
    public function changeorder($faq_data){

       // $collection = $this->faqCollectionFactory->create();
       // $collection->addOrder('sort_order','asc');

       

            $collection = $this->faqCollectionFactory->create();
            if($faq_data['new_position'] > $faq_data['old_position']){
                $operator = 'minus';
                $collection->addFieldToFilter('sort_order', array('gt' => $faq_data['old_position']));
                $collection->addFieldToFilter('sort_order', array('lteq' => $faq_data['new_position']));
            }else{
                $operator = 'plus';
                $collection->addFieldToFilter('sort_order', array('gteq' => $faq_data['new_position']));
                $collection->addFieldToFilter('sort_order', array('lt' => $faq_data['old_position']));
            }

           
            $collection->addOrder('sort_order','asc');
           // return $collection->getData();
            
            foreach($collection as $faq_coll){
                $faqid = $faq_coll->getFaqId();
                $faqs = $this->faqFactory->create()->load($faqid);
                $previous_order = $faqs->getSortOrder();
                if($operator == 'minus'){
                    $current_order = $previous_order -  1 ;
                }else{
                    $current_order = $previous_order + 1 ;
                }
               
                $faqs->setData('sort_order',$current_order);
                $faqs->save();
            }

            $faqs = $this->faqFactory->create()->load($faq_data['faq_id'])->setData('sort_order',$faq_data['new_position'])->save();
            return 'success';
          // $_products->addAttributeToFilter('id', array('gt' => 5));
           
       
            return 'hello';
       // return $collection->getData();
    }

    /**
     * @api
     * @param int $faqId
     * @return \Freshbox\Faqs\Api\Data\FaqInterface
     */
    public function getById($faqId)
    {
        $faq = $this->faqFactory->create();

        $this->resource->load($faq, $faqId);

        if (!$faq->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $faqId));
        }
        return $faq;        
    }       

    /**
     * @api
     * @param \Freshbox\Faqs\Api\Data\Faq $faq
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Faqs\Api\Data\FaqInterface $faq)
    {
        try {
            $this->resource->delete($faq);
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
        $collection = $this->faqCollectionFactory->create();

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
		
		//$collection->addOrder('creation_time','DESC');
        if ($sortOrders) {
          
            foreach ($sortOrders as $sortOrder) {
                $collection->addOrder(
                    $sortOrder->getField(),
                    ($sortOrder->getDirection() == 'ASC') ? 'ASC' : 'DESC'
                );
            }
        }
        $collection->setCurPage($searchCriteria->getCurrentPage());
        $collection->setPageSize($searchCriteria->getPageSize());
        $faqs = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $faqData = $this->dataFaqFactory->create();
            $this->dataObjectHelper->populateWithArray($faqData, $slideModel->getData(), '\Freshbox\Faqs\Api\Data\FaqInterface');
            $faqs[] = $this->dataObjectProcessor->buildOutputDataArray($faqData, '\Freshbox\Faqs\Api\Data\FaqInterface');
        }

        $this->searchResultsFactory->setItems($faqs);
        return $this->searchResultsFactory;

    }
	
	
}