<?php
namespace Freshbox\Meals\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface PreferenceRepositoryInterface
{
    /**
     * Save preference.
     * @param \Freshbox\Meals\Api\Data\PreferenceInterface $preference
     * @return \Freshbox\Meals\Api\Data\PreferenceInterface
     *
     */
    public function save(\Freshbox\Meals\Api\Data\PreferenceInterface  $preference);

    /**
     *  Slide.
     * @param int $preferenceId
     * @return \Freshbox\Meals\Api\Data\PreferenceInterface
     *
     */
    public function getById($preferenceId);

    /**
     * Retrive Meals matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	/**
     * Retrive Meals matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @param int $customerId	 
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getusermealList(SearchCriteriaInterface $criteria,$customerId);
	
	/**
     * Retrive Meals matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @param int $customerId	 
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getadminusermealList(SearchCriteriaInterface $criteria,$customerId);
	
	
    /**
     * @param Freshbox\Meals\Api\Data\PreferenceInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Meals\Api\Data\PreferenceInterface $page);

    /**
     * @param int $preferenceId
     * @return bool true on success
     */
    public function deleteById($preferenceId);
}
