<?php
namespace Freshbox\Subscription\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface RecurringRepositoryInterface
{
    /**
     * Save portion.
     * @param \Freshbox\Subscription\Api\Data\RecurringInterface $recurring    
     * @return \Freshbox\Subscription\Api\Data\RecurringInterface
     *
     */
    public function save(\Freshbox\Subscription\Api\Data\RecurringInterface $recurring);

    /**
     *  Slide.
     * @param int $recurringId
     * @return \Freshbox\Subscription\Api\Data\RecurringInterface
     *
     */
    public function getById($recurringId);

    /**
     * Retrive portions matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Subscription\Api\Data\RecurringInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Subscription\Api\Data\RecurringInterface $page);

    /**
     * @param int $recurringId
     * @return bool true on success
     */
    public function deleteById($recurringId);
}
