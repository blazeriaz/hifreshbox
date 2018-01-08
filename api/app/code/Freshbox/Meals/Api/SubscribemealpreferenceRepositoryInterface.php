<?php
namespace Freshbox\Meals\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface SubscribemealpreferenceRepositoryInterface
{
    /**
     * Save preference.
     * @param \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface $subscribepreference
	 * @param int $customerId
     * @return \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface
     *
     */
    public function save(\Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface  $subscribepreference,$customerId);
	
	/**
     * Save preference.
     * @param mixed $subscribepreference
	 * @param int $customerId
     * @return array
     *
     */ 
	public function customsave($subscribepreference,$customerId);
	
		/**
     * Save preference.
     * @param mixed $subscribepreference
	 * @param int $customer_id
     * @return array
     *
     */ 
	public function adminsave($subscribepreference,$customer_id);

    /**
     *  Slide.
     * @param int $subscribeId
     * @return \Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface
     *
     */
    public function getById($subscribeId);

    /**
     * Retrive Meals matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Meals\Api\Data\SubscribemealpreferenceInterface $page);

    /**
     * @param int $subscribeId
     * @return bool true on success
     */
    public function deleteById($subscribeId);
	
	/**
     * Return Added wishlist info.
     *
     * @param int $customerId
	 * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return array
     *
     */
	/**
     * @api
     * @param int $customerId
	 * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return mixed
     */
	public function getcustomerorder($customerId,SearchCriteriaInterface $criteria);
}
