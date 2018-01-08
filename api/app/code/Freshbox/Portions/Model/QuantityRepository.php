<?php
namespace Freshbox\Portions\Model;

//use Freshbox\Portions\Api\QuantityRepositoryInterface;
//use Freshbox\Portions\Model\QuantityInterface;
//use Freshbox\Portions\Model\QuantityFactory;
//use Freshbox\Portions\Model\ResourceModel\Quantity\CollectionFactory;

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
class QuantityRepository implements \Freshbox\Portions\Api\QuantityRepositoryInterface
{
    /**
     * @var \Freshbox\Portions\Model\ResourceModel\Quantity
     */
    protected $resource;

    /**
     * @var \Freshbox\Portions\Model\QuantityFactory
     */
    protected $quantityFactory;

    /**
     * @var \Freshbox\Portions\Model\ResourceModel\Quantity\CollectionFactory
     */
    protected $quantityCollectionFactory;

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
     * @var \Freshbox\Portions\Api\Data\QuantityInterfaceFactory
     */
    protected $dataQuantityFactory;

    /**
     * @param ResourceModel\Quantity $resource;
     * @param QuantityFactory $quantityFactory
     * @param ResourceModel\Quantity\CollectionFactory $quantityCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Portions\Api\Data\QuantityInterfaceFactory $dataQuantityFactory
     */
    public function __construct(
        \Freshbox\Portions\Model\ResourceModel\Quantity $resource,
		\Freshbox\Portions\Model\QuantityFactory  $quantityFactory,
        \Freshbox\Portions\Model\ResourceModel\Quantity\CollectionFactory $quantityCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Portions\Api\Data\QuantityInterfaceFactory $dataQuantityFactory
    )
    {
        $this->resource = $resource;
        $this->quantityFactory        = $quantityFactory;
        $this->quantityCollectionFactory    = $quantityCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataQuantityFactory = $dataQuantityFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Portions\Api\Data\QuantityInterface $portions
     * @return \Freshbox\Portions\Api\Data\QuantityInterface 
     */
    public function save(\Freshbox\Portions\Api\Data\QuantityInterface $portions)
    {
        try
        {
			
            $this->resource->save($portions);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		// $recipe->getId()
		/*$model = $this->ingredientFactory->create();
		$model->setData('title','riazzz');
    $model->setData('recipe_id', $recipe->getId());
    $model->setData('ingredient_id', 1);
    $model->setData('ingredient_qty', 100);
    $model->setData('portion_id', 2);
    

    $model->save();*/
        return $portions;
    }

    /**
     * @api
     * @param int $portionId
     * @return \Freshbox\Portions\Api\Data\QuantityInterface
     */
    public function getById($portionId)
    {
        $portion = $this->quantityFactory->create();

        $this->resource->load($portion, $portionId);

        if (!$portion->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $portionId));
        }
        return $portion;        
    }       

    /**
     * @api
     * @param \Freshbox\Portions\Api\Data\Quantity $portion
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Portions\Api\Data\QuantityInterface $portion)
    {
        try {
            $this->resource->delete($portion);
        } catch (\Exception $exception) {
            throw new CouldNotDeleteException(__($exception->getMessage()));
        }
        return true;    
    }    

    /**
     * @api
     * @param int $portionId
     * return bool true on success
     */
    public function deleteById($portionId)
    {
        return $this->delete($this->getById($portionId));
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
        $collection = $this->quantityCollectionFactory->create();

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
        $portions = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $portionData = $this->dataQuantityFactory->create();
            $this->dataObjectHelper->populateWithArray($portionData, $slideModel->getData(), '\Freshbox\Portions\Api\Data\QuantityInterface');
            $portions[] = $this->dataObjectProcessor->buildOutputDataArray($portionData, '\Freshbox\Portions\Api\Data\QuantityInterface');
        }

        $this->searchResultsFactory->setItems($portions);
        return $this->searchResultsFactory;

    }
	
	
}