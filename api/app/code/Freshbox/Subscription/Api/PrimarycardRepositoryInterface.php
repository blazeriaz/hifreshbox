<?php
namespace Freshbox\Subscription\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface PrimarycardRepositoryInterface
{
    /**
     * Save portion.
	 * @param int $customerId
     * @param \Freshbox\Subscription\Api\Data\PrimarycardInterface $primary_card    
     * @return \Freshbox\Subscription\Api\Data\PrimarycardInterface
     *
     */
    public function save($customerId,\Freshbox\Subscription\Api\Data\PrimarycardInterface $primary_card);

    /**
     *  Slide.
     * @param int $primarycardId
     * @return \Freshbox\Subscription\Api\Data\PrimarycardInterface
     *
     */
    public function getById($primarycardId);

    /**
     * Retrive portions matching the specified criteria
    * @param int $customerId
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList($customerId,SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Subscription\Api\Data\PrimarycardInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Subscription\Api\Data\PrimarycardInterface $page);

    /**
     * @param int $primarycardId
     * @return bool true on success
     */
    public function deleteById($primarycardId);
}
