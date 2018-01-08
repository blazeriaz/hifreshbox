<?php
namespace Freshbox\Contact\Model;

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
class EnquiryRepository implements \Freshbox\Contact\Api\EnquiryRepositoryInterface
{
    /**
     * @var \Freshbox\Contact\Model\ResourceModel\Enquiry
     */
    protected $resource;

    /**
     * @var \Freshbox\Contact\Model\EnquiryFactory
     */
    protected $enquiryFactory;

    /**
     * @var \Freshbox\Contact\Model\ResourceModel\Enquiry\CollectionFactory
     */
    protected $enquiryCollectionFactory;

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
     * @var \Freshbox\Contact\Api\Data\EnquiryInterfaceFactory
     */
    protected $dataEnquiryFactory;
	
	/**
     * @var \Magento\Framework\Mail\Template\TransportBuilder
     */
    protected $_transportBuilder;
	
	/**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;
	
	/**
	 * @var \Magento\Framework\App\Request\Http
	 */
	protected $_request;

    /**
     * @param ResourceModel\Enquiry $resource;
     * @param EnquiryFactory $enquiryFactory
     * @param ResourceModel\Enquiry\CollectionFactory $enquiryCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Contact\Api\Data\EnquiryInterfaceFactory $dataEnquiryFactory
	 * @param \Magento\Framework\Mail\Template\TransportBuilder $transportBuilder
	 * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     */
    public function __construct(
        \Freshbox\Contact\Model\ResourceModel\Enquiry $resource,
		\Freshbox\Contact\Model\EnquiryFactory  $enquiryFactory,
        \Freshbox\Contact\Model\ResourceModel\Enquiry\CollectionFactory $enquiryCollectionFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
		\Magento\Framework\App\Config\ScopeConfigInterface $setscopeConfig,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Contact\Api\Data\EnquiryInterfaceFactory $dataEnquiryFactory,
		\Magento\Framework\Mail\Template\TransportBuilder $transportBuilder,
		\Magento\Store\Model\StoreManagerInterface $storeManager,
		\Magento\Framework\App\Request\Http $request,
		\Magento\Framework\App\Action\Context $context
    )
    {
        $this->resource = $resource;
        $this->enquiryFactory        = $enquiryFactory;
        $this->enquiryCollectionFactory    = $enquiryCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataEnquiryFactory = $dataEnquiryFactory;
		$this->storeManager = $storeManager;
		$this->setscopeConfig = $setscopeConfig;
		$this->_transportBuilder = $transportBuilder;
		 $this->_request = $request;
		  parent::__construct($context);
    }
    
    /**
     * @api
     * @param \Freshbox\Contact\Api\Data\EnquiryInterface $enquiry
     * @return \Freshbox\Contact\Api\Data\EnquiryInterface 
     */
    public function save(\Freshbox\Contact\Api\Data\EnquiryInterface $enquiry)
    {
        try
        {
			
            $this->resource->save($enquiry);
		
		 $customer_support_name =  $this->setscopeConfig->getValue('trans_email/ident_support/name', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 $customer_support_email =  $this->setscopeConfig->getValue('trans_email/ident_support/email', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		 
		 return $customer_support_name. '==>'.$customer_support_email;
			
			 $store = $this->_storeManager->getStore()->getId();
			  $sender = [
            'name'  => 'Riaz',
            'email' => 'md.riaz.samsys@gmail.com',
            ];
			
			$data_val = [
				'store'   => $this->_storeManager->getStore(),
				'telephone'         => '9566220411',
				'shape'         => 'shape',
				'comment'       => $enquiry['message'],
				'name'			=>'Riaz',
				'email'			=>$enquiry['email']
			];
			$postObject = new \Magento\Framework\DataObject();
			$postObject->setData($data_val);
			$transport = $this->_transportBuilder->setTemplateIdentifier('contact_email_email_template')
            ->setTemplateOptions(['area' => \Magento\Framework\App\Area::AREA_FRONTEND, 'store' => $store])
            ->setTemplateVars(['data'=>$postObject])
            ->setFrom($sender)
			->addTo($enquiry['email'])
            ->getTransport();
        $transport->sendMessage();
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $enquiry;
    }

    /**
     * @api
     * @param int $enquiryId
     * @return \Freshbox\Contact\Api\Data\EnquiryInterface
     */
    public function getById($enquiryId)
    {
        $enquiry = $this->enquiryFactory->create();

        $this->resource->load($enquiry, $enquiryId);

        if (!$enquiry->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $enquiryId));
        }
        return $enquiry;        
    }       

    /**
     * @api
     * @param \Freshbox\Contact\Api\Data\Enquiry $enquiry
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Contact\Api\Data\EnquiryInterface $enquiry)
    {
        try {
            $this->resource->delete($enquiry);
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
        $collection = $this->enquiryCollectionFactory->create();

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
        $enquires = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $enquiryData = $this->dataEnquiryFactory->create();
            $this->dataObjectHelper->populateWithArray($enquiryData, $slideModel->getData(), '\Freshbox\Contact\Api\Data\EnquiryInterface');
            $enquires[] = $this->dataObjectProcessor->buildOutputDataArray($enquiryData, '\Freshbox\Contact\Api\Data\EnquiryInterface');
        }

        $this->searchResultsFactory->setItems($enquires);
        return $this->searchResultsFactory;

    }
	
	
}