<?php
namespace Freshbox\Wallet\Api;

//use Freshbox\Portions\Model\QuantityInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface TranscationRepositoryInterface
{
    /**
     * Save portion.
	 * @param int $customerId
     * @param \Freshbox\Wallet\Api\Data\TranscationInterface $transcation
     * @return \Freshbox\Wallet\Api\Data\TranscationInterface
     *
     */
    public function save($customerId,\Freshbox\Wallet\Api\Data\TranscationInterface  $transcation);

    /**
     *  Slide.
     * @param int $id
     * @return \Freshbox\Wallet\Api\Data\TranscationInterface
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
     * @param Freshbox\Wallet\Api\Data\TranscationInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Wallet\Api\Data\TranscationInterface $page);

    /**
     * @param int $id
     * @return bool true on success
     */
    public function deleteById($id);
}
