<?php
namespace Freshbox\Faqs\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface FaqRepositoryInterface
{
    /**
     * Save portion.
     * @param \Freshbox\Faqs\Api\Data\FaqInterface $faq
     * @return \Freshbox\Faqs\Api\Data\FaqInterface
     *
     */
    public function save(\Freshbox\Faqs\Api\Data\FaqInterface  $faq);

    /**
     * @param mixed $faq_data
     * @return array
     */
    public function changeorder($faq_data);

    

    /**
     *  Slide.
     * @param int $faqId
     * @return \Freshbox\Faqs\Api\Data\FaqInterface
     *
     */
    public function getById($faqId);

    /**
     * Retrive portions matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param Freshbox\Faqs\Api\Data\FaqInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Faqs\Api\Data\FaqInterface $page);

    /**
     * @param int $faqId
     * @return bool true on success
     */
    public function deleteById($faqId);
}
