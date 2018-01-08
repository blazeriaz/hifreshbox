<?php
namespace Freshbox\Cookbook\Api;

//use Freshbox\Cookbook\Model\BookInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface BookRepositoryInterface
{
    /**
     * Save cookbook.
     * @param \Freshbox\Cookbook\Api\Data\BookInterface $recipe
     * @return \Freshbox\Cookbook\Api\Data\BookInterface
     *
     */
    public function save(\Freshbox\Cookbook\Api\Data\BookInterface  $cookbook);

    /**
     *  Slide.
     * @param int $cookbookId
     * @return \Freshbox\Cookbook\Api\Data\BookInterface
     *
     */
    public function getById($cookbookId);

    /**
     * Retrive cookbook matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Cookbook\Api\Data\BookInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Cookbook\Api\Data\BookInterface $page);

    /**
     * @param int $cookbookId
     * @return bool true on success
     */
    public function deleteById($cookbookId);
}
