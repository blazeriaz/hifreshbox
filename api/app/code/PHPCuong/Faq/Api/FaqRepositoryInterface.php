<?php
namespace PHPCuong\Faq\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface FaqRepositoryInterface
{
   /**
     * Save data.
     * @param mixed $faq_data
     * @return array
     *
     */
    public function save($faq_data);
	
	/**
     * get config data.
     * @return array
     *
     */
	public function getlist();

   
}
