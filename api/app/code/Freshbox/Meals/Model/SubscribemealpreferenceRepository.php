<?php
namespace Freshbox\Meals\Model;



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
class SubscribemealpreferenceRepository implements \Freshbox\Meals\Api\SubscribemealpreferenceRepositoryInterface
{
    /**
     * @var \Freshbox\Meals\Model\ResourceModel\Subscribemealpreference
     */
    protected $resource;

    /**
     * @var \Freshbox\Meals\Model\SubscribemealpreferenceFactory
     */
    protected $subscribemealpreferenceFactory;

    /**
     * @var \Freshbox\Meals\Model\ResourceModel\Subscribemealpreference\CollectionFactory
     */
    protected $subscribemealpreferenceCollectionFactory;

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
     * @var \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterfaceFactory
     */
    protected $dataSubscribemealpreferenceFactory;

    /**
     * @param ResourceModel\Subscribemealpreference $resource;
     * @param SubscribemealpreferenceFactory $subscribemealpreferenceFactory
     * @param ResourceModel\Subscribemealpreference\CollectionFactory $subscribemealpreferenceCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterfaceFactory $dataSubscribemealpreferenceFactory
     */
    public function __construct(
        \Freshbox\Meals\Model\ResourceModel\Subscribemealpreference $resource,
		\Freshbox\Meals\Model\SubscribemealpreferenceFactory  $subscribemealpreferenceFactory,
        \Freshbox\Meals\Model\ResourceModel\Subscribemealpreference\CollectionFactory $subscribemealpreferenceCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
		\Magento\Sales\Model\ResourceModel\Order\CollectionFactory $orderCollectionFactory,
        \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterfaceFactory $dataSubscribemealpreferenceFactory
		
		
    )
    {
        $this->resource = $resource;
        $this->subscribemealpreferenceFactory        = $subscribemealpreferenceFactory;
        $this->subscribemealpreferenceCollectionFactory    = $subscribemealpreferenceCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataSubscribemealpreferenceFactory = $dataSubscribemealpreferenceFactory;
		 $this->_orderCollectionFactory = $orderCollectionFactory;
		
		
    }
	
	/**
     * Save preference.
     * @param mixed $subscribepreference
	 * @param int $customer_id
     * @return array
     *
     */
	public function adminsave($subscribepreference,$customer_id){
		$customerId = $customer_id;
		
		try{
		$collection = $this->subscribemealpreferenceCollectionFactory->create();
			
		$collection->addFieldToFilter('user_id', $customerId);
		
		$user_preference = $collection->getData();
		
		if(count($user_preference) == 0){
		
			$subscribepreference['user_id'] = $customerId;
			
			if(is_array($subscribepreference['meal_preference_setting'])){
				$subscribepreference['meal_preference_setting'] = json_encode($subscribepreference['meal_preference_setting']);
			}
			
            $this->resource->save($subscribepreference);
		}else{ 
			
			if(is_array($subscribepreference['meal_preference_setting'])){
				$meal_preference_setting = json_encode($subscribepreference['meal_preference_setting']);
			}else{
				$meal_preference_setting = $subscribepreference['meal_preference_setting'];
			}
					$model = $this->subscribemealpreferenceFactory->create()->load($user_preference[0]['id']);
					$model->setData('meal_preference_setting',$meal_preference_setting);
					$model->setData('howmuch_meals_week', $subscribepreference['howmuch_meals_week']);
					$model->setData('howmany_people', $subscribepreference['howmany_people']);
					$model->setData('meal_extra_notes', $subscribepreference['meal_extra_notes']);
					$model->save();
			
		} 
		}catch(\Exception $e){
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		return $subscribepreference;
	}
	
	/**
     * Save preference.
     * @param mixed $subscribepreference
	 * @param int $customerId
     * @return array
     *
     */
	public function customsave($subscribepreference,$customerId){
		
		try{
		$collection = $this->subscribemealpreferenceCollectionFactory->create();
			
		$collection->addFieldToFilter('user_id', $customerId);
		
		$user_preference = $collection->getData();
		
		if(count($user_preference) == 0){
		
			$subscribepreference['user_id'] = $customerId;
			
			if(is_array($subscribepreference['meal_preference_setting'])){
				$subscribepreference['meal_preference_setting'] = json_encode($subscribepreference['meal_preference_setting']);
			}
			
            $this->resource->save($subscribepreference);
		}else{ 
			
			if(is_array($subscribepreference['meal_preference_setting'])){
				$meal_preference_setting = json_encode($subscribepreference['meal_preference_setting']);
			}else{
				$meal_preference_setting = $subscribepreference['meal_preference_setting'];
			}
					$model = $this->subscribemealpreferenceFactory->create()->load($user_preference[0]['id']);
					$model->setData('meal_preference_setting',$meal_preference_setting);
					$model->setData('howmuch_meals_week', $subscribepreference['howmuch_meals_week']);
					$model->setData('howmany_people', $subscribepreference['howmany_people']);
					$model->setData('meal_extra_notes', $subscribepreference['meal_extra_notes']);
					$model->save();
			
		} 
		}catch(\Exception $e){
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		return $subscribepreference;
	}
    
    /**
     * @api
     * @param \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface $subscribepreference
	 * @param int $customerId
     * @return \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface 
     */
    public function save(\Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface $subscribepreference,$customerId)
    {
		
        try
        {
			
		$collection = $this->subscribemealpreferenceCollectionFactory->create();
			
		$collection->addFieldToFilter('user_id', $customerId);
		
		$user_preference = $collection->getData();
		
		if(count($user_preference) == 0){
		
			$subscribepreference['user_id'] = $customerId;
			
			if(is_array($subscribepreference['meal_preference_setting'])){
				$subscribepreference['meal_preference_setting'] = json_encode($subscribepreference['meal_preference_setting']);
			}
			
            $this->resource->save($subscribepreference);
		}else{ 
			
			if(is_array($subscribepreference['meal_preference_setting'])){
				$meal_preference_setting = json_encode($subscribepreference['meal_preference_setting']);
			}else{
				$meal_preference_setting = $subscribepreference['meal_preference_setting'];
			}
			$model = $this->subscribemealpreferenceFactory->create()->load($user_preference[0]['id']);
					$model->setData('meal_preference_setting',$meal_preference_setting);
					$model->setData('howmuch_meals_week', $subscribepreference['howmuch_meals_week']);
					$model->setData('howmany_people', $subscribepreference['howmany_people']);
					$model->setData('meal_extra_notes', $subscribepreference['meal_extra_notes']);
					$model->save();
			
		}
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $subscribepreference;
    }

    /**
     * @api
     * @param int $subscribeId
     * @return \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface
     */
    public function getById($subscribeId)
    {
        $subscribepreference = $this->preferenceFactory->create();

        $this->resource->load($subscribepreference, $subscribeId);

        if (!$subscribepreference->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $subscribeId));
        }
        return $subscribepreference;        
    }       

    /**
     * @api
     * @param \Freshbox\Meals\Api\Data\PreferenceInterface $subscribepreference
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface $subscribepreference)
    {
        try {
            $this->resource->delete($subscribepreference);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__($exception->getMessage()));
        }
        return true;    
    }    

    /**
     * @api
     * @param int $subscribeId
     * return bool true on success
     */
    public function deleteById($subscribeId)
    {
        return $this->delete($this->getById($subscribeId));
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
        $collection = $this->subscribemealpreferenceCollectionFactory->create();

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
        $preference = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
		$i = 0;
        foreach($collection as $slideModel) {
            $preferenceData = $this->dataSubscribemealpreferenceFactory->create();
            $this->dataObjectHelper->populateWithArray($preferenceData, $slideModel->getData(), '\Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface');
            $preference[$i] = $this->dataObjectProcessor->buildOutputDataArray($preferenceData, '\Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface');
		
			/*------------------------------*/
			
			
        }

        $this->searchResultsFactory->setItems($preference);
        return $this->searchResultsFactory;

    }
	/**
     * @api
     * @param int $customerId
	 * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return mixed
     */
	public function getcustomerorder($customerId,\Magento\Framework\Api\SearchCriteriaInterface $criteria){
		
				
		if($criteria->getPageSize()){
			$page_size = $criteria->getPageSize();
		}else{
			$page_size = 5;
		}
		
		if($criteria->getCurrentPage()){
			$current_page = $criteria->getCurrentPage();
		}else{
			$current_page = 1;
		}
		
		
		
		$collection = $this->_orderCollectionFactory->create()->addAttributeToSelect('*');
		$collection->addFieldToFilter('customer_id', $customerId);
		$collection->setOrder('entity_id','DESC');
        $collection->setPageSize($page_size);
        $collection->setCurPage($current_page);
		$total_record = $collection->getSize();
		$order_items = $collection->getData();
		$result['items'] = $order_items;
		$result[]['page_size'] = $page_size;
		$result[]['current_page'] = $current_page;
		$result[]['total_record'] = $total_record;
		return $result;
		
	}
	
	
}