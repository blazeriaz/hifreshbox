<?php
namespace Freshbox\Newsletter\Api;

//use Freshbox\Newsletter\Model\SubscriberInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface SubscriberRepositoryInterface
{
    

    /**
     * Retrive ingredients matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	/**
     * Save data.
     * @param string $email
     * @return array
     *
     */
	public function save($email);
	
	/**
     * Save data.
     * @param mixed $newaddress
     * @return array
     *
     */
	public function newaddress($newaddress);
    
}
