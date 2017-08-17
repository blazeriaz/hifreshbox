<?php
namespace Freshbox\Portions\Api;

//use Freshbox\Portions\Model\QuantityInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface QuantityRepositoryInterface
{
    /**
     * Save portion.
     * @param \Freshbox\Portions\Api\Data\QuantityInterface $portion
     * @return \Freshbox\Portions\Api\Data\QuantityInterface
     *
     */
    public function save(\Freshbox\Portions\Api\Data\QuantityInterface  $portion);

    /**
     *  Slide.
     * @param int $portionId
     * @return \Freshbox\Portions\Api\Data\QuantityInterface
     *
     */
    public function getById($portionId);

    /**
     * Retrive portions matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Portions\Api\Data\QuantityInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Portions\Api\Data\QuantityInterface $page);

    /**
     * @param int $portionId
     * @return bool true on success
     */
    public function deleteById($portionId);
}
