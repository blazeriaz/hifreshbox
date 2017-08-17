<?php
namespace Freshbox\Ingredients\Model;

//use Freshbox\Ingredients\Api\IngredientRepositoryInterface;
//use Freshbox\Ingredients\Model\IngredientInterface;
//use Freshbox\Ingredients\Model\IngredientFactory;
//use Freshbox\Ingredients\Model\ResourceModel\Ingredient\CollectionFactory;

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
class IngredientRepository implements \Freshbox\Ingredients\Api\IngredientRepositoryInterface
{
    /**
     * @var \Freshbox\Ingredients\Model\ResourceModel\Ingredient
     */
    protected $resource;

    /**
     * @var \Freshbox\Ingredients\Model\IngredientFactory
     */
    protected $ingredientFactory;

    /**
     * @var \Freshbox\Ingredients\Model\ResourceModel\Ingredient\CollectionFactory
     */
    protected $ingredientCollectionFactory;

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
     * @var \Freshbox\Ingredients\Api\Data\IngredientInterfaceFactory
     */
    protected $dataIngredientFactory;

    /**
     * @param ResourceModel\Ingredient $resource;
     * @param IngredientFactory $ingredientFactory
     * @param ResourceModel\Ingredient\CollectionFactory $ingredientCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Ingredients\Api\Data\IngredientInterfaceFactory $dataIngredientFactory
     */
    public function __construct(
        \Freshbox\Ingredients\Model\ResourceModel\Ingredient $resource,
		\Freshbox\Ingredients\Model\IngredientFactory  $ingredientFactory,
        \Freshbox\Ingredients\Model\ResourceModel\Ingredient\CollectionFactory $ingredientCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Ingredients\Api\Data\IngredientInterfaceFactory $dataIngredientFactory
    )
    {
        $this->resource = $resource;
        $this->ingredientFactory        = $ingredientFactory;
        $this->ingredientCollectionFactory    = $ingredientCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataIngredientFactory = $dataIngredientFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Ingredients\Api\Data\IngredientInterface $ingredient
     * @return \Freshbox\Ingredients\Api\Data\IngredientInterface 
     */
    public function save(\Freshbox\Ingredients\Api\Data\IngredientInterface $ingredient)
    {
        try
        {
			
            $this->resource->save($ingredient);
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
        return $ingredient;
    }

    /**
     * @api
     * @param int $ingredientId
     * @return \Freshbox\Ingredients\Api\Data\IngredientInterface
     */
    public function getById($ingredientId)
    {
        $ingredient = $this->ingredientFactory->create();

        $this->resource->load($ingredient, $ingredientId);

        if (!$ingredient->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $recipeId));
        }
        return $ingredient;        
    }       

    /**
     * @api
     * @param \Freshbox\Ingredients\Api\Data\IngredientInterface $ingredient
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Ingredients\Api\Data\IngredientInterface $ingredient)
    {
        try {
            $this->resource->delete($ingredient);
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
        $collection = $this->ingredientCollectionFactory->create();

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
        $ingredients = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $ingredientData = $this->dataIngredientFactory->create();
            $this->dataObjectHelper->populateWithArray($ingredientData, $slideModel->getData(), '\Freshbox\Ingredients\Api\Data\IngredientInterface');
            $ingredients[] = $this->dataObjectProcessor->buildOutputDataArray($ingredientData, '\Freshbox\Ingredients\Api\Data\IngredientInterface');
        }

        $this->searchResultsFactory->setItems($ingredients);
        return $this->searchResultsFactory;
/* Modified by Jeff on Jun 23r, 2017
        $objects = [];                                     
        foreach ($collection as $objectModel) {
            $objects[] = $objectModel;
        }
        $searchResults->setItems($objects);
        return $searchResults; 
*/
    }
	
	
}