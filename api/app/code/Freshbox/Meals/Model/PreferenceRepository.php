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
class PreferenceRepository implements \Freshbox\Meals\Api\PreferenceRepositoryInterface
{
    /**
     * @var \Freshbox\Meals\Model\ResourceModel\Preference
     */
    protected $resource;

    /**
     * @var \Freshbox\Meals\Model\PreferenceFactory
     */
    protected $preferenceFactory;

    /**
     * @var \Freshbox\Meals\Model\ResourceModel\Preference\CollectionFactory
     */
    protected $preferenceCollectionFactory;

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
     * @var \Freshbox\Meals\Api\Data\PreferenceInterfaceFactory
     */
    protected $dataPreferenceFactory;

    /**
     * @param ResourceModel\Preference $resource;
     * @param PreferenceFactory $preferenceFactory
     * @param ResourceModel\Preference\CollectionFactory $preferenceCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Meals\Api\Data\PreferenceInterfaceFactory $dataPreferenceFactory
     */
    public function __construct(
        \Freshbox\Meals\Model\ResourceModel\Preference $resource,
		\Freshbox\Meals\Model\PreferenceFactory  $preferenceFactory,
        \Freshbox\Meals\Model\ResourceModel\Preference\CollectionFactory $preferenceCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Meals\Api\Data\PreferenceInterfaceFactory $dataPreferenceFactory,
		\Freshbox\Meals\Model\SubscribemealpreferenceFactory  $subscribemealpreferenceFactory,
        \Freshbox\Meals\Model\ResourceModel\Subscribemealpreference\CollectionFactory $subscribemealpreferenceCollectionFactory,
		\Freshbox\Meals\Model\ResourceModel\Preferenceoption\CollectionFactory $preferenceoptionCollectionFactory
		
    )
    {
        $this->resource = $resource;
        $this->preferenceFactory        = $preferenceFactory;
        $this->preferenceCollectionFactory    = $preferenceCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataPreferenceFactory = $dataPreferenceFactory;
		 $this->subscribemealpreferenceFactory        = $subscribemealpreferenceFactory;
        $this->subscribemealpreferenceCollectionFactory    = $subscribemealpreferenceCollectionFactory;
		$this->preferenceoptionCollectionFactory    = $preferenceoptionCollectionFactory;
		
    }
    
    /**
     * @api
     * @param \Freshbox\Meals\Api\Data\PreferenceInterface $preference
     * @return \Freshbox\Meals\Api\Data\PreferenceInterface 
     */
    public function save(\Freshbox\Meals\Api\Data\PreferenceInterface $preference)
    {
        try
        {
			
            $this->resource->save($preference);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $preference;
    }

    /**
     * @api
     * @param int $preferenceId
     * @return \Freshbox\Meals\Api\Data\PreferenceInterface
     */
    public function getById($preferenceId)
    {
        $preference = $this->preferenceFactory->create();

        $this->resource->load($preference, $preferenceId);

        if (!$preference->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $preferenceId));
        }
        return $preference;        
    }       

    /**
     * @api
     * @param \Freshbox\Meals\Api\Data\PreferenceInterface $preference
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Meals\Api\Data\PreferenceInterface $preference)
    {
        try {
            $this->resource->delete($preference);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__($exception->getMessage()));
        }
        return true;    
    }    

    /**
     * @api
     * @param int $preferenceId
     * return bool true on success
     */
    public function deleteById($preferenceId)
    {
        return $this->delete($this->getById($preferenceId));
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
        $collection = $this->preferenceCollectionFactory->create();

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
            $preferenceData = $this->dataPreferenceFactory->create();
            $this->dataObjectHelper->populateWithArray($preferenceData, $slideModel->getData(), '\Freshbox\Meals\Api\Data\PreferenceInterface');
            $preference[$i] = $this->dataObjectProcessor->buildOutputDataArray($preferenceData, '\Freshbox\Meals\Api\Data\PreferenceInterface');
		
			/*------------------------------*/
			
			$collection = $this->preferenceoptionCollectionFactory->create();
			
		$collection->addFieldToFilter('preference_id', $slideModel->getId());
		
		$collection->setOrder('sort_order','asc');
		$preference[$i]['options'] = $collection->getData();
		
		
			$i++;
        }

        $this->searchResultsFactory->setItems($preference);
        return $this->searchResultsFactory;

    }
	
	
	/**
     * @api
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
	 * @param int $customerId
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getadminusermealList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria,$customerId)
    {
        $collection = $this->subscribemealpreferenceCollectionFactory->create();
			
		$collection->addFieldToFilter('user_id', $customerId);
		
		$user_preference = $collection->getData();
				
        $searchResults = $this->searchResultsFactory; //->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->preferenceCollectionFactory->create();

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
        //$searchResults->setRiaz('hello');

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
            $preferenceData = $this->dataPreferenceFactory->create();
            $this->dataObjectHelper->populateWithArray($preferenceData, $slideModel->getData(), '\Freshbox\Meals\Api\Data\PreferenceInterface');
            $preference[$i] = $this->dataObjectProcessor->buildOutputDataArray($preferenceData, '\Freshbox\Meals\Api\Data\PreferenceInterface');
		
			/*------------------------------*/
			
			$collection = $this->preferenceoptionCollectionFactory->create();
			$collection->addFieldToFilter('preference_id', $slideModel->getId());
			$collection->setOrder('sort_order','asc');
			$options = [];
			if(count($user_preference) > 0){
				
				$pref = $user_preference[0]['meal_preference_setting'];
			
				
			$s = 0;
			foreach($collection->getData() as $option_data){
				$preference_id = $option_data['preference_id'];
				$option_id =  $option_data['preference_option_id'];
				$user_selected = $this->checkisselected($preference_id,$option_id,$pref);
				
				$options[$s] = $option_data;
				if($user_selected){
				
				
				$options[$s]['is_selected'] = $user_selected['is_selected'];
				$options[$s]['selected_qty'] = $user_selected['qty'];
				}
				$s++;
			}
			}else{
				$options = $collection->getData();
			}
			
			$preference[$i]['options'] = $options;
			$i++;
        }
		
		
		if(count($user_preference) > 0){
			$howmuch_meals_week = $user_preference[0]['howmuch_meals_week'];
		$howmany_people = $user_preference[0]['howmany_people'];
		$meal_extra_notes = $user_preference[0]['meal_extra_notes'];
		$meal_preferencee = array('items'=>$preference,
								array('howmany_people'=>$howmany_people),
								array('howmuch_meals_week'=>$howmuch_meals_week),
								array('meal_extra_notes'=>$meal_extra_notes)
								);
			
		}else{
				$howmuch_meals_week = '';
		$howmany_people = '';
		$meal_extra_notes = '';
		$meal_preferencee = array('items'=>$preference,
								array('howmany_people'=>$howmany_people),
								array('howmuch_meals_week'=>$howmuch_meals_week),
								array('meal_extra_notes'=>$meal_extra_notes)
								);
			
			
		}
		
		
		
		return $meal_preferencee;			
		
       

    }
	
	/**
     * @api
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
	 * @param int $customerId
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getusermealList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria,$customerId)
    {
        $collection_pref = $this->subscribemealpreferenceCollectionFactory->create();
			
		$collection_pref->addFieldToFilter('user_id', $customerId);
		
		$user_preference = $collection_pref->getData();
				
        $searchResults = $this->searchResultsFactory; //->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->preferenceCollectionFactory->create();
		
		
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
        //$searchResults->setRiaz('hello');

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
            $preferenceData = $this->dataPreferenceFactory->create();
            $this->dataObjectHelper->populateWithArray($preferenceData, $slideModel->getData(), '\Freshbox\Meals\Api\Data\PreferenceInterface');
            $preference[$i] = $this->dataObjectProcessor->buildOutputDataArray($preferenceData, '\Freshbox\Meals\Api\Data\PreferenceInterface');
		
			/*------------------------------*/
			
			$preference_option = $this->preferenceoptionCollectionFactory->create();
			$preference_option->addFieldToFilter('preference_id', $slideModel->getId());
			$preference_option->setOrder('sort_order','asc');
			$options = [];
			if(count($user_preference) > 0){
				
				$pref = $user_preference[0]['meal_preference_setting'];
			
				
				$s = 0;
				foreach($preference_option->getData() as $option_data){
					$preference_id = $option_data['preference_id'];
					$option_id =  $option_data['preference_option_id'];
					$user_selected = $this->checkisselected($preference_id,$option_id,$pref);
					
					$options[$s] = $option_data;
					if($user_selected){
					
					
					$options[$s]['is_selected'] = $user_selected['is_selected'];
					$options[$s]['selected_qty'] = $user_selected['qty'];
					}
					$s++;
				}
			}else{
				$options = $preference_option->getData();
			}
			
			$preference[$i]['options'] = $options;
			$i++;
        }
		
		
		
		if(count($user_preference) > 0){
			$howmuch_meals_week = $user_preference[0]['howmuch_meals_week'];
		$howmany_people = $user_preference[0]['howmany_people'];
		$meal_extra_notes = $user_preference[0]['meal_extra_notes'];
		$meal_preferencee = array('items'=>$preference,
								array('howmany_people'=>$howmany_people),
								array('howmuch_meals_week'=>$howmuch_meals_week),
								array('meal_extra_notes'=>$meal_extra_notes)
								);
			
		}else{
				$howmuch_meals_week = '';
		$howmany_people = '';
		$meal_extra_notes = '';
		$meal_preferencee = array('items'=>$preference,
								array('howmany_people'=>$howmany_people),
								array('howmuch_meals_week'=>$howmuch_meals_week),
								array('meal_extra_notes'=>$meal_extra_notes)
								);
			
			
		}
				
		return $meal_preferencee;
       

    }
	
	public function checkisselected($preference_id,$option_id,$pref){
		$preference_result = json_decode($pref);
		
		foreach($preference_result as $user_selected){
			
			if($user_selected->question_id == $preference_id && $user_selected->option_id == $option_id){
				return array('is_selected'=>1,'qty'=>$user_selected->qty);
			}
			
		}
		return false;
	}
	
	
}