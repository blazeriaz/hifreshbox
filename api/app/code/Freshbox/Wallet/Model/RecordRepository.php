<?php
namespace Freshbox\Wallet\Model;


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
class RecordRepository implements \Freshbox\Wallet\Api\RecordRepositoryInterface
{
    /**
     * @var \Freshbox\Wallet\Model\ResourceModel\Record
     */
    protected $resource;

    /**
     * @var \Freshbox\Wallet\Model\RecordFactory
     */
    protected $recordFactory;

    /**
     * @var \Freshbox\Wallet\Model\ResourceModel\Record\CollectionFactory
     */
    protected $recordCollectionFactory;

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
     * @var \Freshbox\Wallet\Api\Data\RecordInterfaceFactory
     */
    protected $dataRecordFactory;

    /**
     * @param ResourceModel\Record $resource;
     * @param RecordFactory $recordFactory
     * @param ResourceModel\Record\CollectionFactory $recordCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Wallet\Api\Data\RecordInterfaceFactory $dataRecordFactory
     */
    public function __construct(
        \Freshbox\Wallet\Model\ResourceModel\Record $resource,
		\Freshbox\Wallet\Model\RecordFactory  $recordFactory,
        \Freshbox\Wallet\Model\ResourceModel\Record\CollectionFactory $recordCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Wallet\Api\Data\RecordInterfaceFactory $dataRecordFactory
    )
    {
        $this->resource = $resource;
        $this->recordFactory        = $recordFactory;
        $this->recordCollectionFactory    = $recordCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataRecordFactory = $dataRecordFactory;
    }
    
    /**
     * @api
	 * @param int $customerId
     * @param \Freshbox\Wallet\Api\Data\RecordInterface $record
     * @return \Freshbox\Wallet\Api\Data\RecordInterface 
     */
    public function save($customerId,\Freshbox\Wallet\Api\Data\RecordInterface $record)
    {
        try
        {
			$record['customer_id'] = $customerId;
            $this->resource->save($record);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $record;
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Wallet\Api\Data\RecordInterface
     */
    public function getById($id)
    {
        $record = $this->recordFactory->create();

        $this->resource->load($record, $id);

        if (!$record->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $id));
        }
        return $record;        
    }       

    /**
     * @api
     * @param \Freshbox\Wallet\Api\Data\Record $record
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Wallet\Api\Data\RecordInterface $record)
    {
        try {
            $this->resource->delete($record);
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
       
        $searchResults = $this->searchResultsFactory; 
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->recordCollectionFactory->create();

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
        $record = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $recordData = $this->dataRecordFactory->create();
            $this->dataObjectHelper->populateWithArray($recordData, $slideModel->getData(), '\Freshbox\Wallet\Api\Data\RecordInterface');
            $record[] = $this->dataObjectProcessor->buildOutputDataArray($recordData, '\Freshbox\Wallet\Api\Data\RecordInterface');
        }

        $this->searchResultsFactory->setItems($record);
        return $this->searchResultsFactory;

    }
	
	
}