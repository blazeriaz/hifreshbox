<?php
namespace Freshbox\Wallet\Api;

//use Freshbox\Portions\Model\QuantityInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface RecordRepositoryInterface
{
    /**
     * Save portion.
	 * @param int $customerId
     * @param \Freshbox\Wallet\Api\Data\RecordInterface $record
     * @return \Freshbox\Wallet\Api\Data\RecordInterface
     *
     */
    public function save($customerId,\Freshbox\Wallet\Api\Data\RecordInterface  $record);

    /**
     *  Slide.
     * @param int $id
     * @return \Freshbox\Wallet\Api\Data\RecordInterface
     *
     */
    public function getById($id);

    /**
     * Retrive portions matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Wallet\Api\Data\RecordInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Wallet\Api\Data\RecordInterface $page);

    /**
     * @param int $id
     * @return bool true on success
     */
    public function deleteById($id);
}
