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
class WalletRepository implements \Freshbox\Wallet\Api\WalletRepositoryInterface
{
    /**
     * @var \Freshbox\Wallet\Model\ResourceModel\Wallet
     */
    protected $resource;

    /**
     * @var \Freshbox\Wallet\Model\WalletFactory
     */
    protected $walletFactory;

    /**
     * @var \Freshbox\Wallet\Model\ResourceModel\Wallet\CollectionFactory
     */
    protected $walletCollectionFactory;

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
     * @var \Freshbox\Wallet\Api\Data\WalletInterfaceFactory
     */
    protected $dataWalletFactory;

    /**
     * @param ResourceModel\Wallet $resource;
     * @param WalletFactory $walletFactory
     * @param ResourceModel\Wallet\CollectionFactory $walletCollectionFactory
     * @param \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory
     * @param DataObjectHelper $dataObjectHelper
     * @param DataObjectProcessor $dataObjectProcessor
     * @param \Freshbox\Wallet\Api\Data\WalletInterfaceFactory $dataWalletFactory
     */
    public function __construct(
        \Freshbox\Wallet\Model\ResourceModel\Wallet $resource,
		\Freshbox\Wallet\Model\WalletFactory  $walletFactory,
        \Freshbox\Wallet\Model\ResourceModel\Wallet\CollectionFactory $walletCollectionFactory,
        \Freshbox\Wallet\Model\RecordFactory  $recordFactory,
        \Magento\Framework\Api\SearchResultsInterface $searchResultsFactory,
         \Freshbox\Wallet\Model\ResourceModel\Record\CollectionFactory $recordCollectionFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Freshbox\Wallet\Model\TranscationFactory  $transcationFactory,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Freshbox\Wallet\Api\Data\WalletInterfaceFactory $dataWalletFactory
    )
    {
        $this->resource = $resource;
        $this->walletFactory        = $walletFactory;
        $this->recordFactory        = $recordFactory;
        $this->recordCollectionFactory    = $recordCollectionFactory;
        $this->walletCollectionFactory    = $walletCollectionFactory;
        $this->searchResultsFactory = $searchResultsFactory;
        $this->transcationFactory        = $transcationFactory;
        $this->dataObjectHelper = $dataObjectHelper;
        $this->dataObjectProcessor = $dataObjectProcessor;
        $this->dataWalletFactory = $dataWalletFactory;
    }
    
    /**
     * @api
     * @param \Freshbox\Wallet\Api\Data\WalletInterface $wallet
     * @return \Freshbox\Wallet\Api\Data\WalletInterface 
     */
    public function save(\Freshbox\Wallet\Api\Data\WalletInterface $wallet)
    {
        try
        {
			
            $this->resource->save($wallet);
        }
        catch(\Exception $e)
        {
            throw new CouldNotSaveException(__($e->getMessage()));
        }
		
        return $wallet;
    }

    /**
     * @api
     * @param int $walletId
     * @return \Freshbox\Wallet\Api\Data\WalletInterface
     */
    public function getById($walletId)
    {
        $wallet = $this->walletFactory->create();

        $this->resource->load($wallet, $walletId);

        if (!$wallet->getId()) {
            throw new NoSuchEntityException(__('Object with id "%1" does not exist.', $walletId));
        }
        return $wallet;        
    }       

    /**
     * @api
     * @param \Freshbox\Wallet\Api\Data\Wallet $wallet
     * @return bool ture if success 
     */
    public function delete(\Freshbox\Wallet\Api\Data\WalletInterface $wallet)
    {
        try {
            $this->resource->delete($wallet);
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
       
        $searchResults = $this->searchResultsFactory; 
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->walletCollectionFactory->create();
		$collection->addFieldToFilter('customer_id', $customerId);
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
        $wallets = [];

        /** @var \Foggyline\Slider\Model\Slide $slideModel */
        foreach($collection as $slideModel) {
            $walletData = $this->dataWalletFactory->create();
            $this->dataObjectHelper->populateWithArray($walletData, $slideModel->getData(), '\Freshbox\Wallet\Api\Data\WalletInterface');
            $wallets[] = $this->dataObjectProcessor->buildOutputDataArray($walletData, '\Freshbox\Wallet\Api\Data\WalletInterface');
        }

        $this->searchResultsFactory->setItems($wallets);
        return $this->searchResultsFactory;

    }

   
    /**
    * @param int $customerId
    * @return mixed
     */
    public function redeem($customerId,$redeem_data){

        $code = $redeem_data['redeemed_code'];
        if($code){
         $collection = $this->walletCollectionFactory->create();
	 	 $collection->addFieldToFilter('is_redeemed', 0);
         $collection->addFieldToFilter('redeemed_code', $code);
         if($collection->count() > 0){
              $redeemed_data_user = $collection->getFirstItem(); 
             // return $redeemed_data_user->getData();
                // Saving transcation
                	$transcation_data = $this->transcationFactory->create();
					$transcation_data->setData('order_id',$redeemed_data_user->getOrderId());
					$transcation_data->setData('customer_id', $customerId);
					$transcation_data->setData('redeemed_id', $redeemed_data_user->getWalletId());
					$transcation_data->setData('amount', $redeemed_data_user->getAmount());
					$transcation_data->setData('status', 1);
					$transcation_data->setData('action', 'credit');
					$transcation_data->save();

                // updating the Redeemed Code to used status
              	$wallet_redeem = $this->walletFactory->create()->load($redeemed_data_user->getWalletId());
		        $wallet_redeem->setData('is_redeemed',1);
                $wallet_redeem->setData('redeemed_user',$customerId);
				$wallet_redeem->save();

                $wallet_record = $this->recordCollectionFactory->create();
                $wallet_record->addFieldToFilter('customer_id', $customerId);
                  if($wallet_record->count() > 0){
                        $wallet_rd = $wallet_record->getFirstItem();

                       $record_id = $wallet_rd->getId();
                       $total_amount = $wallet_rd->getTotalAmount();
                       $remaining_amount = $wallet_rd->getRemainingAmount();
                       $used_amount = $wallet_rd->getUsedAmount();

                       $redeemed_total_amount = $total_amount + $redeemed_data_user->getAmount();
                       $redeemed_remaining_amount = $remaining_amount + $redeemed_data_user->getAmount();

                        $new_custom_record = $this->recordFactory->create()->load($record_id);
                        $new_custom_record->setData('total_amount',$redeemed_total_amount);
                        $new_custom_record->setData('remaining_amount',$redeemed_remaining_amount);
                        $new_custom_record->save();

                  }else{
                        $new_custom_record = $this->recordFactory->create();
                        $new_custom_record->setData('customer_id',$customerId); 
                        $new_custom_record->setData('total_amount',$redeemed_data_user->getAmount());
                        $new_custom_record->setData('remaining_amount',$redeemed_data_user->getAmount());
                        $new_custom_record->setData('used_amount',0);
                        $new_custom_record->save();
                  }

                 return $new_custom_record->getData();
               // $this->recordFactory->create()->load('customer_id',$);


         }else{
             return array('status'=>'error','msg'=>'Code Does Not Exit');
         }

       }else{
          return array('status'=>'error','msg'=>'Redeem Code Field cannot be Empty.');
        }
        
    }
	
	
}