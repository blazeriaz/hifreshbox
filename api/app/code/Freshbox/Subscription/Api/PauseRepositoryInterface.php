<?php
namespace Freshbox\Subscription\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface PauseRepositoryInterface
{
    /**
     * Save portion.
	 * @param int $customerId
     * @param \Freshbox\Subscription\Api\Data\PauseInterface $week    
     * @return \Freshbox\Subscription\Api\Data\PauseInterface
     *
     */
    public function save($customerId,\Freshbox\Subscription\Api\Data\PauseInterface $week);

    /**
     *  Slide.
     * @param int $pauseId
     * @return \Freshbox\Subscription\Api\Data\PauseInterface
     *
     */
    public function getById($pauseId);

    /**
     * Retrive portions matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Subscription\Api\Data\PauseInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Subscription\Api\Data\PauseInterface $page);

    /**
     * @param int $pauseId
     * @return bool true on success
     */
    public function deleteById($pauseId);
}
