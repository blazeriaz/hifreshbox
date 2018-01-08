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
class TranscationRepository implements \Freshbox\Wallet\Api\TranscationRepositoryInterface
{
    /**
     * @var \Freshbox\Wallet\Model\ResourceModel\Transcation
     */
    protected $resource;

    /**
     * @var \Freshbox\Wallet\Model\TranscationFactory
     */
    protected $transcationFactory;

    /**
     * @var \Freshbox\Wallet\Model\ResourceModel\Transcation\CollectionFactory
     */
    protected $transcationCollectionFactory;

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
     * @var \Freshbox\Wallet\Api\Data\TranscationInterfaceFactory
     */
    protected $dataTranscationFactory;

    /**
     * @param ResourceModel\Transcation $resource;
     * @param TranscationFactory $transcationFactory
     * @param ResourceModel\Transcation\CollectionFactory $transcationCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Wallet\Api\Data\TranscationInterfaceFactory $dataTranscationFactory
     */
    public function __construct(
        \Freshbox\Wallet\Model\ResourceModel\Transcation $resource,
		\Freshbox\Wallet\Model\TranscationFactory  $transcationFactory,
        \Freshbox\Wallet\Model\ResourceModel\Transcation\CollectionFactory $transcationCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Wallet\Api\Data\TranscationInterfaceFactory $dataTranscationFactory
    )
    {
        $this->resource = $resource;
        $this->transcationFactory        = $transcationFactory;
        $this->transcationCollectionFactory    = $transcationCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataTranscationFactory = $dataTranscationFactory;
    }
    
    /**
     * @api
	 * @param int $customerId
     * @param \Freshbox\Wallet\Api\Data\TranscationInterface $transcation
     * @return \Freshbox\Wallet\Api\Data\TranscationInterface 
     */
    public function save($customerId,\Freshbox\Wallet\Api\Data\TranscationInterface $transcation)
    {
        try
        {
			$transcation['customer_id'] = $customerId;
            $this->resource->save($transcation);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $transcation;
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Wallet\Api\Data\TranscationInterface
     */
    public function getById($id)
    {
        $transcation = $this->transcationFactory->create();

        $this->resource->load($transcation, $id);

        if (!$transcation->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $id));
        }
        return $transcation;        
    }       

    /**
     * @api
     * @param \Freshbox\Wallet\Api\Data\Transcation $transcation
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Wallet\Api\Data\TranscationInterface $transcation)
    {
        try {
            $this->resource->delete($transcation);
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
        $collection = $this->transcationCollectionFactory->create();

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
        $transcations = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $transcationData = $this->dataTranscationFactory->create();
            $this->dataObjectHelper->populateWithArray($transcationData, $slideModel->getData(), '\Freshbox\Wallet\Api\Data\TranscationInterface');
            $transcations[] = $this->dataObjectProcessor->buildOutputDataArray($transcationData, '\Freshbox\Wallet\Api\Data\TranscationInterface');
        }

        $this->searchResultsFactory->setItems($transcations);
        return $this->searchResultsFactory;

    }
	
	
}