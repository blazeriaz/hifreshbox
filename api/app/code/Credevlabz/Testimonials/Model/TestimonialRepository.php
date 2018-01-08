<?php
namespace Credevlabz\Testimonials\Model;



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
class TestimonialRepository implements \Credevlabz\Testimonials\Api\TestimonialRepositoryInterface
{
    /**
     * @var \Credevlabz\Testimonials\Model\ResourceModel\Testimonial
     */
    protected $resource;

    /**
     * @var \Credevlabz\Testimonials\Model\TestimonialFactory
     */
    protected $testimonialFactory;

    /**
     * @var \Credevlabz\Testimonials\Model\ResourceModel\Testimonial\CollectionFactory
     */
    protected $testimonialCollectionFactory;

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
     * @var \Credevlabz\Testimonials\Api\Data\TestimonialInterfaceFactory
     */
    protected $dataTestimonialFactory;

    /**
     * @param ResourceModel\Testimonial $resource;
     * @param TestimonialFactory $testimonialFactory
     * @param ResourceModel\Testimonial\CollectionFactory $testimonialCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Credevlabz\Testimonials\Api\Data\TestimonialInterfaceFactory $dataTestimonialFactory
     */
    public function __construct(
        \Credevlabz\Testimonials\Model\ResourceModel\Testimonial $resource,
		\Credevlabz\Testimonials\Model\TestimonialFactory  $testimonialFactory,
        \Credevlabz\Testimonials\Model\ResourceModel\Testimonial\CollectionFactory $testimonialCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Credevlabz\Testimonials\Api\Data\TestimonialInterfaceFactory $dataTestimonialFactory
    )
    {
        $this->resource = $resource;
        $this->testimonialFactory        = $testimonialFactory;
        $this->testimonialCollectionFactory    = $testimonialCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataTestimonialFactory = $dataTestimonialFactory;
    }
    
    /**
     * @api
     * @param \Credevlabz\Testimonials\Api\Data\TestimonialInterface $testimonial
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface 
     */
    public function save(\Credevlabz\Testimonials\Api\Data\TestimonialInterface $testimonial)
    {
        try
        {
			$collection = $this->testimonialCollectionFactory->create();
			$testimonial_cnt = $collection->count();

			$sort_order = $testimonial_cnt + 1;
			$testimonial['sort_order'] = $sort_order;
            $this->resource->save($testimonial);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $testimonial;
    }
	
	 /**
     * @param mixed $testimonial_data
     * @return mixed
     */
    public function changeorder($testimonial_data){

       // $collection = $this->faqCollectionFactory->create();
       // $collection->addOrder('sort_order','asc');

       

            $collection = $this->testimonialCollectionFactory->create();
            if($testimonial_data['new_position'] > $testimonial_data['old_position']){
                $operator = 'minus';
                $collection->addFieldToFilter('sort_order', array('gt' => $testimonial_data['old_position']));
                $collection->addFieldToFilter('sort_order', array('lteq' => $testimonial_data['new_position']));
            }else{
                $operator = 'plus';
                $collection->addFieldToFilter('sort_order', array('gteq' => $testimonial_data['new_position']));
                $collection->addFieldToFilter('sort_order', array('lt' => $testimonial_data['old_position']));
            }

           
            $collection->addOrder('sort_order','asc');
           // return $collection->getData();
            
            foreach($collection as $test_coll){
                $testid = $test_coll->getTestimonialId();
                $testimonial = $this->testimonialFactory->create()->load($testid);
                $previous_order = $testimonial->getSortOrder();
                if($operator == 'minus'){
                    $current_order = $previous_order -  1 ;
                }else{
                    $current_order = $previous_order + 1 ;
                }
               
                $testimonial->setData('sort_order',$current_order);
                $testimonial->save();
            }

            $faqs = $this->testimonialFactory->create()->load($testimonial_data['testimonial_id'])->setData('sort_order',$testimonial_data['new_position'])->save();
            return 'success';
          // $_products->addAttributeToFilter('id', array('gt' => 5));
           
       
           
       // return $collection->getData();
    }

    /**
     * @api
     * @param int $testimonialId
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function getById($testimonialId)
    {
        $testimonial = $this->testimonialFactory->create();

        $this->resource->load($testimonial, $testimonialId);

        if (!$testimonial->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $testimonialId));
        }
        return $testimonial;        
    }       

    /**
     * @api
     * @param \Credevlabz\Testimonials\Api\Data\TestimonialInterface $testimonial
     * @return bool ture if success 
     */
    public function delete(\Credevlabz\Testimonials\Api\Data\TestimonialInterface $testimonial)
    {
        try {
            $this->resource->delete($testimonial);
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
       
        $searchResults = $this->searchResultsFactory; //->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->testimonialCollectionFactory->create();
		
		//return $collection->getData();
		//$collection->addOrder('sort_order','asc');
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
		
		//return $sortOrders->getData();
        if ($sortOrders) {
            /** @var SortOrder $sortOrder */
            foreach ($sortOrders as $sortOrder) {
                $collection->addOrder(
                    $sortOrder->getField(),
                    ($sortOrder->getDirection() == 'ASC') ? 'ASC' : 'DESC'
                );
            }
        }
        $collection->setCurPage($searchCriteria->getCurrentPage());
        $collection->setPageSize($searchCriteria->getPageSize());
        $testimonial = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $testimonialData = $this->dataTestimonialFactory->create();
            $this->dataObjectHelper->populateWithArray($testimonialData, $slideModel->getData(), '\Credevlabz\Testimonials\Api\Data\TestimonialInterface');
            $testimonial[] = $this->dataObjectProcessor->buildOutputDataArray($testimonialData, '\Credevlabz\Testimonials\Api\Data\TestimonialInterface');
        }

        $this->searchResultsFactory->setItems($testimonial);
        return $this->searchResultsFactory;

    }
	
	
}