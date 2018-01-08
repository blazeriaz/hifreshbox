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
class RecurringRepository implements \Freshbox\Subscription\Api\RecurringRepositoryInterface
{
    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Recurring
     */
    protected $resource;

    /**
     * @var \Freshbox\Subscription\Model\RecurringFactory
     */
    protected $recurringFactory;

    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Recurring\CollectionFactory
     */
    protected $recurringCollectionFactory;

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
     * @var \Freshbox\Subscription\Api\Data\RecurringInterfaceFactory
     */
    protected $dataRecurringFactory;

    /**
     * @param ResourceModel\Recurring $resource;
     * @param RecurringFactory $recurringFactory
     * @param ResourceModel\Recurring\CollectionFactory $recurringCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Subscription\Api\Data\RecurringInterfaceFactory $dataRecurringFactory
     */
    public function __construct(
        \Freshbox\Subscription\Model\ResourceModel\Recurring $resource,
		\Freshbox\Subscription\Model\RecurringFactory  $recurringFactory,
        \Freshbox\Subscription\Model\ResourceModel\Recurring\CollectionFactory $recurringCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Subscription\Api\Data\RecurringInterfaceFactory $dataRecurringFactory
    )
    {
        $this->resource = $resource;
        $this->recurringFactory        = $recurringFactory;
        $this->recurringCollectionFactory    = $recurringCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataRecurringFactory = $dataRecurringFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Subscription\Api\Data\RecurringInterface $recurring     
     * @return \Freshbox\Subscription\Api\Data\RecurringInterface 
     */
    public function save(\Freshbox\Subscription\Api\Data\RecurringInterface $recurring)
    {
        try
        {
			
            $this->resource->save($recurring);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $recurring;
    }

    /**
     * @api
     * @param int $recurringId
     * @return \Freshbox\Subscription\Api\Data\RecurringInterface
     */
    public function getById($recurringId)
    {
        $recurring_subscription = $this->recurringFactory->create();

        $this->resource->load($recurring_subscription, $recurringId);

        if (!$recurring_subscription->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $recurringId));
        }
        return $recurring_subscription;        
    }       

    /**
     * @api
     * @param \Freshbox\Subscription\Api\Data\Recurring $recurring
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Subscription\Api\Data\RecurringInterface $recurring)
    {
        try {
            $this->resource->delete($recurring);
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
        $collection = $this->recurringCollectionFactory->create();

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
        $recurring_subscription = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $recurringData = $this->dataRecurringFactory->create();
            $this->dataObjectHelper->populateWithArray($recurringData, $slideModel->getData(), '\Freshbox\Subscription\Api\Data\RecurringInterface');
            $recurring_subscription[] = $this->dataObjectProcessor->buildOutputDataArray($recurringData, '\Freshbox\Subscription\Api\Data\RecurringInterface');
        }

        $this->searchResultsFactory->setItems($recurring_subscription);
        return $this->searchResultsFactory;

    }
	
	
}