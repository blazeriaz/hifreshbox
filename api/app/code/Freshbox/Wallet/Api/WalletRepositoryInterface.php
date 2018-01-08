<?php
namespace Freshbox\Wallet\Api;

//use Freshbox\Portions\Model\QuantityInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface WalletRepositoryInterface
{
    /**
     * Save portion.
     * @param \Freshbox\Wallet\Api\Data\WalletInterface $wallet
     * @return \Freshbox\Wallet\Api\Data\WalletInterface
     *
     */
    public function save(\Freshbox\Wallet\Api\Data\WalletInterface  $wallet);

    /**
     *  Slide.
     * @param int $walletId
     * @return \Freshbox\Wallet\Api\Data\WalletInterface
     *
     */
    public function getById($walletId);

    /**
     * Retrive portions matching the specified criteria
	  * @param int $customerId
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList($customerId,SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Wallet\Api\Data\WalletInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Wallet\Api\Data\WalletInterface $page);

    /**
     * @param int $walletId
     * @return bool true on success
     */
    public function deleteById($walletId);

     /**
     * Retrive portions matching the specified criteria
	 * @param int $customerId
     * @param mixed $redeem_data
     * @return array
     */
    public function redeem($customerId,$redeem_data);


}
