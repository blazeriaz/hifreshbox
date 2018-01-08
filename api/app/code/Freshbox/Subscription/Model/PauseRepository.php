<?php
namespace Freshbox\Subscription\Model;



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
class PauseRepository implements \Freshbox\Subscription\Api\PauseRepositoryInterface
{
    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Pause
     */
    protected $resource;

    /**
     * @var \Freshbox\Subscription\Model\PauseFactory
     */
    protected $pauseFactory;

    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Pause\CollectionFactory
     */
    protected $pauseCollectionFactory;

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
     * @var \Freshbox\Subscription\Api\Data\PauseInterfaceFactory
     */
    protected $dataPauseFactory;

    /**
     * @param ResourceModel\Pause $resource;
     * @param PauseFactory $pauseFactory
     * @param ResourceModel\Pause\CollectionFactory $pauseCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Subscription\Api\Data\PauseInterfaceFactory $dataPauseFactory
     */
    public function __construct(
        \Freshbox\Subscription\Model\ResourceModel\Pause $resource,
		\Freshbox\Subscription\Model\PauseFactory  $pauseFactory,
        \Freshbox\Subscription\Model\ResourceModel\Pause\CollectionFactory $pauseCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Subscription\Api\Data\PauseInterfaceFactory $dataPauseFactory
    )
    {
        $this->resource = $resource;
        $this->pauseFactory        = $pauseFactory;
        $this->pauseCollectionFactory    = $pauseCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataPauseFactory = $dataPauseFactory;
    }
    
    /**
     * @api
	 * @param int $customerId
     * @param \Freshbox\Subscription\Api\Data\PauseInterface $pause     
     * @return \Freshbox\Subscription\Api\Data\PauseInterface 
     */
    public function save($customerId,\Freshbox\Subscription\Api\Data\PauseInterface $pause)
    {
        try
        {
			$pause['user_id'] = $customerId;
			$week_no = $pause['week_no'];
			$year = $pause['year'];
			
			$pause_query = $this->pauseCollectionFactory->create();
			$pause_query->addFieldToFilter('user_id', $customerId);
            if(count($pause_query) > 0){
                foreach($pause_query as $pause_data){
                   $id =  $pause_data->getPauseId();
                   $this->deleteById($id);
                }
            }
			
			
            $this->resource->save($pause);
			
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $pause;
    }

    /**
     * @api
     * @param int $pauseId
     * @return \Freshbox\Subscription\Api\Data\PauseInterface
     */
    public function getById($pauseId)
    {
        $pause_subscription = $this->pauseFactory->create();

        $this->resource->load($pause_subscription, $pauseId);

        if (!$pause_subscription->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $recurringId));
        }
        return $pause_subscription;        
    }       

    /**
     * @api
     * @param \Freshbox\Subscription\Api\Data\Pause $pause
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Subscription\Api\Data\PauseInterface $pause)
    {
        try {
            $this->resource->delete($pause);
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
        $collection = $this->pauseCollectionFactory->create();

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
        $pause_subscription = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $pauseData = $this->dataPauseFactory->create();
            $this->dataObjectHelper->populateWithArray($pauseData, $slideModel->getData(), '\Freshbox\Subscription\Api\Data\PauseInterface');
            $pause_subscription[] = $this->dataObjectProcessor->buildOutputDataArray($pauseData, '\Freshbox\Subscription\Api\Data\PauseInterface');
        }

        $this->searchResultsFactory->setItems($pause_subscription);
        return $this->searchResultsFactory;

    }
	
	
}