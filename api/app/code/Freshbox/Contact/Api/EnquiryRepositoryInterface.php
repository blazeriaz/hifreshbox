<?php
namespace Freshbox\Contact\Api;

//use Freshbox\Portions\Model\QuantityInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface EnquiryRepositoryInterface
{
    /**
     * Save portion.
     * @param \Freshbox\Contact\Api\Data\EnquiryInterface $enquiry
     * @return \Freshbox\Contact\Api\Data\EnquiryInterface
     *
     */
    public function save(\Freshbox\Contact\Api\Data\EnquiryInterface  $enquiry);


    /**
     *  Slide.
     * @param int $enquiryId
     * @return \Freshbox\Contact\Api\Data\EnquiryInterface
     *
     */
    public function getById($enquiryId);

    /**
     * Retrive portions matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Contact\Api\Data\EnquiryInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Contact\Api\Data\EnquiryInterface $page);

    /**
     * @param int $enquiryId
     * @return bool true on success
     */
    public function deleteById($enquiryId);
}
