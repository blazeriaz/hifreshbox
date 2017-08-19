<?php
namespace Freshbox\Selections\Model;
use Freshbox\Selections\Api\SelectRepositoryInterface;
use Freshbox\Ingredients\Model\ResourceModel\Ingredient\CollectionFactory as IngredientCollectionFactory;
use Freshbox\Portions\Model\ResourceModel\Quantity\CollectionFactory as QuantityCollectionFactory;
use Magento\Framework\App\ResourceConnectionFactory;
/**
 * Class WebServiceRepository
 * @package Demac\WebService\Model
 */
class SelectRepository implements SelectRepositoryInterface
{
    /**
     * @var ResourceConnectionFactory
     */
    protected $_resourceConnection;
    /**
     * @var IngredientCollectionFactory
     */
    protected $_ingredientCollection;
	
	/**
     * @var QuantityCollectionFactory
     */
    protected $_quantityCollection;
   
    /**
     * SelectRepository constructor.
     *
     * @param ResourceConnectionFactory $_resourceConnection
     */
    public function __construct(ResourceConnectionFactory $_resourceConnection, IngredientCollectionFactory $_ingredientCollection,QuantityCollectionFactory $_quantityCollection)
    {
        $this->_resourceConnection = $_resourceConnection;
        $this->_ingredientCollection = $_ingredientCollection;
        $this->_quantityCollection = $_quantityCollection;
        
    }
    /**
     * @return int
     */
    public function getlistselection()
    {
        $ingredient_datas = $this->_ingredientCollection->create()->getData();
        $portions_datas = $this->_quantityCollection->create()->getData();
		
		
		$response[] = array('ingredients'=>$ingredient_datas,'portions'=>$portions_datas);
	
		return $response;
		
    }
    
}