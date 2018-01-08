<?php
namespace Freshbox\Subscription\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface MainRepositoryInterface
{
    /**
     * Save portion.
     * @param \Freshbox\Subscription\Api\Data\MainInterface $subscription
     * @param int $customerId
     * @return \Freshbox\Subscription\Api\Data\MainInterface
     *
     */
    public function save(\Freshbox\Subscription\Api\Data\MainInterface $subscription,$customerId);

    /**
     *  Slide.
     * @param int $subscriptionId
     * @return \Freshbox\Subscription\Api\Data\MainInterface
     *
     */
    public function getById($subscriptionId);

    /**
     * Retrive portions matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Subscription\Api\Data\MainInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Subscription\Api\Data\MainInterface $page);

    /**
     * @param int $subscriptionId
     * @return bool true on success
     */
    public function deleteById($subscriptionId);
	
	/**
     * @param int $customerId
     * @return array
     */
	 public function getMysubscription($customerId);
	 
	 /**
     * @param int $customerId
     * @param int $subscriptionId
     * @return array
     */
	 public function unsubscribe($customerId,$subscriptionId);
	 
	  /**
     * @param int $customerId
     * @param int $subscriptionId
     * @return array
     */
	 public function viewsubscription($customerId,$subscriptionId);
	 
	 /**
     * Return Added wishlist info.
     *
     * @param int $customerId
	 * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return array
     *
     */
	 public function getsubscriptionorders($customerId,SearchCriteriaInterface $criteria);
	 
	 /**
     * Return Added wishlist info.
     *
     * @param int $customerId
	 * 
     * @return array
     *
     */
	 public function listcreditcard($customerId); 
	 
	 /**
     * Return Added wishlist info.
     * 
     * @param int $customerId
	 * @param mixed $public_hash	
	 * 
     * @return array
     *
     */
	 public function getpaymentnonce($customerId,$public_hash);
	 
	 /**
     * @api
     * @param int $customerId
	 * 
     * @return array
     */
	public function getcustomertranscation($customerId);
	
	 /**
     * Return Added wishlist info.
     * 
     * @param int $customerId
	 * @param mixed $public_hash	
	 * 
     * @return array
     *
     */
	public function deletecard($customerId,$public_hash);
}
