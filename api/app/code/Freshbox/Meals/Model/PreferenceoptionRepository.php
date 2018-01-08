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
class PreferenceoptionRepository implements \Freshbox\Meals\Api\PreferenceoptionRepositoryInterface
{
    /**
     * @var \Freshbox\Meals\Model\ResourceModel\Preferenceoption
     */
    protected $resource;

    /**
     * @var \Freshbox\Meals\Model\PreferenceoptionFactory
     */
    protected $preferenceoptionFactory;

    /**
     * @var \Freshbox\Meals\Model\ResourceModel\Preferenceoption\CollectionFactory
     */
    protected $preferenceoptionCollectionFactory;

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
     * @var \Freshbox\Meals\Api\Data\PreferenceoptionInterfaceFactory
     */
    protected $dataPreferenceoptionFactory;
	
	

    /**
     * @param ResourceModel\Preferenceoption $resource;
     * @param PreferenceoptionFactory $preferenceoptionFactory
     * @param ResourceModel\Preferenceoption\CollectionFactory $preferenceoptionCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Meals\Api\Data\PreferenceoptionInterfaceFactory $dataPreferenceoptionFactory
     */
    public function __construct(
        \Freshbox\Meals\Model\ResourceModel\Preferenceoption $resource,
		\Freshbox\Meals\Model\PreferenceoptionFactory  $preferenceoptionFactory,
        \Freshbox\Meals\Model\ResourceModel\Preferenceoption\CollectionFactory $preferenceoptionCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Meals\Api\Data\PreferenceoptionInterfaceFactory $dataPreferenceoptionFactory
		
		
    )
    {
        $this->resource = $resource;
        $this->preferenceoptionFactory        = $preferenceoptionFactory;
        $this->preferenceoptionCollectionFactory    = $preferenceoptionCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataPreferenceoptionFactory = $dataPreferenceoptionFactory;
		
        
    }
    
    /**
     * @api
     * @param \Freshbox\Meals\Api\Data\PreferenceoptionInterface $preference_option
     * @return \Freshbox\Meals\Api\Data\PreferenceoptionInterface 
     */
    public function save(\Freshbox\Meals\Api\Data\PreferenceoptionInterface $preference_option)
    {
        try
        {
			
            $this->resource->save($preference_option);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $preference_option;
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Meals\Api\Data\PreferenceoptionInterface
     */
    public function getById($id)
    {
        $preference_option = $this->preferenceoptionFactory->create();

        $this->resource->load($preference_option, $id);

        if (!$preference_option->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $id));
        }
        return $preference_option;        
    }       

    /**
     * @api
     * @param \Freshbox\Meals\Api\Data\PreferenceoptionInterface $preference_option
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Meals\Api\Data\PreferenceoptionInterface $preference_option)
    {
        try {
            $this->resource->delete($preference_option);
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


}