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
class PrimarycardRepository implements \Freshbox\Subscription\Api\PrimarycardRepositoryInterface
{
    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Primarycard
     */
    protected $resource;

    /**
     * @var \Freshbox\Subscription\Model\PrimarycardFactory
     */
    protected $primarycardFactory;

    /**
     * @var \Freshbox\Subscription\Model\ResourceModel\Primarycard\CollectionFactory
     */
    protected $primarycardCollectionFactory;

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
     * @var \Freshbox\Subscription\Api\Data\PrimarycardInterfaceFactory
     */
    protected $dataPrimarycardFactory;

    /**
     * @param ResourceModel\Primarycard $resource;
     * @param PrimarycardFactory $primarycardFactory
     * @param ResourceModel\Primarycard\CollectionFactory $primarycardCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Subscription\Api\Data\PrimarycardInterfaceFactory $dataPrimarycardFactory
     */
    public function __construct(
        \Freshbox\Subscription\Model\ResourceModel\Primarycard $resource,
		\Freshbox\Subscription\Model\PrimarycardFactory  $primarycardFactory,
        \Freshbox\Subscription\Model\ResourceModel\Primarycard\CollectionFactory $primarycardCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Subscription\Api\Data\PrimarycardInterfaceFactory $dataPrimarycardFactory
    )
    {
        $this->resource = $resource;
        $this->primarycardFactory        = $primarycardFactory;
        $this->primarycardCollectionFactory    = $primarycardCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataPrimarycardFactory = $dataPrimarycardFactory;
    }
    
    /**
     * @api
	 * @param int $customerId
     * @param \Freshbox\Subscription\Api\Data\PrimarycardInterface $primary_card     
     * @return \Freshbox\Subscription\Api\Data\PrimarycardInterface 
     */
    public function save($customerId,\Freshbox\Subscription\Api\Data\PrimarycardInterface $primary_card)
    {
        try
        {
			$primary_card['user_id'] = $customerId;
			
			
			$primary_card_query = $this->primarycardCollectionFactory->create();
			$primary_card_query->addFieldToFilter('user_id', $customerId);
            $cnt_coll = $primary_card_query->count();
            if($cnt_coll > 0){
                foreach($primary_card_query as $card_data){
                   $id =  $card_data->getPrimaryCardId();
                   $this->deleteById($id);
                }
            }
			
			
            $this->resource->save($primary_card);
			
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $primary_card;
    }

    /**
     * @api
     * @param int $primarycardId
     * @return \Freshbox\Subscription\Api\Data\PrimarycardInterface
     */
    public function getById($primarycardId)
    {
        $primary_card = $this->primarycardFactory->create();

        $this->resource->load($primary_card, $primarycardId);

        if (!$primary_card->getPrimaryCardId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $primarycardId));
        }
        return $primary_card;        
    }       

    /**
     * @api
     * @param \Freshbox\Subscription\Api\Data\Primarycard $primary_card
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Subscription\Api\Data\PrimarycardInterface $primary_card)
    {
        try {
            $this->resource->delete($primary_card);
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
	 * @param int $customerId
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList($customerId,\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        
        $searchResults = $this->searchResultsFactory; //->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->primarycardCollectionFactory->create();
		$collection->addFieldToFilter('user_id', $customerId);

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
        $primary_card_list = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $primaryData = $this->dataPrimarycardFactory->create();
            $this->dataObjectHelper->populateWithArray($primaryData, $slideModel->getData(), '\Freshbox\Subscription\Api\Data\PrimarycardInterface');
            $primary_card_list[] = $this->dataObjectProcessor->buildOutputDataArray($primaryData, '\Freshbox\Subscription\Api\Data\PrimarycardInterface');
        }

        $this->searchResultsFactory->setItems($primary_card_list);
        return $this->searchResultsFactory;

    }
	
	
}