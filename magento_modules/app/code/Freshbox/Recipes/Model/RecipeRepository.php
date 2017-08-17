<?php
namespace Freshbox\Recipes\Model;

//use Freshbox\Recipes\Api\RecipeRepositoryInterface;
//use Freshbox\Recipes\Model\RecipeInterface;
//use Freshbox\Recipes\Model\RecipeFactory;
//use Freshbox\Recipes\Model\ResourceModel\Recipe\CollectionFactory;

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
class RecipeRepository implements \Freshbox\Recipes\Api\RecipeRepositoryInterface
{
    /**
     * @var \Freshbox\Recipes\Model\ResourceModel\Recipe
     */
    protected $resource;

    /**
     * @var \Freshbox\Recipes\Model\RecipeFactory
     */
    protected $recipeFactory;

    /**
     * @var \Freshbox\Recipes\Model\ResourceModel\Recipe\CollectionFactory
     */
    protected $recipeCollectionFactory;

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
     * @var \Freshbox\Recipes\Api\Data\RecipeInterfaceFactory
     */
    protected $dataRecipeFactory;

    /**
     * @param ResourceModel\Recipe $resource;
     * @param SlideFactory $recipeFactory
     * @param ResourceModel\Slide\CollectionFactory $recipeCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Recipes\Api\Data\RecipeInterfaceFactory $dataRecipeFactory
     */
    public function __construct(
        \Freshbox\Recipes\Model\ResourceModel\Recipe $resource,
		\Freshbox\Recipes\Model\ResourceModel\Ingredient $ingredientresource,
        \Freshbox\Recipes\Model\RecipeFactory  $recipeFactory,
        \Freshbox\Recipes\Model\IngredientFactory  $ingredientFactory,
        \Freshbox\Recipes\Model\ResourceModel\Recipe\CollectionFactory $recipeCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Recipes\Api\Data\RecipeInterfaceFactory $dataRecipeFactory
    )
    {
        $this->resource = $resource;
        $this->recipeFactory        = $recipeFactory;
        $this->ingredientFactory        = $ingredientFactory;
        $this->recipeCollectionFactory    = $recipeCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataRecipeFactory = $dataRecipeFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Recipes\Api\Data\RecipeInterface $recipe
     * @return \Freshbox\Recipes\Api\Data\RecipeInterface 
     */
    public function save(\Freshbox\Recipes\Api\Data\RecipeInterface $recipe)
    {
        try
        {
			
            $this->resource->save($recipe);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		// $recipe->getId()
		$model = $this->ingredientFactory->create();
		$model->setData('title','riazzz');
   /* $model->setData('recipe_id', $recipe->getId());
    $model->setData('ingredient_id', 1);
    $model->setData('ingredient_qty', 100);
    $model->setData('portion_id', 2);*/
    

    $model->save();
        return $recipe;
    }

    /**
     * @api
     * @param int $recipeId
     * @return \Freshbox\Recipes\Api\Data\RecipeInterface
     */
    public function getById($recipeId)
    {
        $recipe = $this->RecipeFactory->create();

        $this->resource->load($recipe, $recipeId);

        if (!$recipe->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $recipeId));
        }
        return $recipe;        
    }       

    /**
     * @api
     * @param \Freshbox\Recipes\Api\Data\RecipeInterface $recipe
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Recipes\Api\Data\RecipeInterface $recipe)
    {
        try {
            $this->resource->delete($recipe);
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
        $collection = $this->recipeCollectionFactory->create();

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
        $recipes = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $recipeData = $this->dataSlideFactory->create();
            $this->dataObjectHelper->populateWithArray($recipeData, $slideModel->getData(), '\Freshbox\Recipes\Api\Data\RecipeInterface');
            $recipes[] = $this->dataObjectProcessor->buildOutputDataArray($recipeData, '\Freshbox\Recipes\Api\Data\RecipeInterface');
        }

        $this->searchResultsFactory->setItems($recipes);
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