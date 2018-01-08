<?php
namespace Credevlabz\Testimonials\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface TestimonialRepositoryInterface
{
    /**
     * Save testimonial.
     * @param \Credevlabz\Testimonials\Api\Data\TestimonialInterface $testimonial
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface 
     *
     */
    public function save(\Credevlabz\Testimonials\Api\Data\TestimonialInterface  $testimonial);

    /**
     *  Slide.
     * @param int $testimonialId
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     *
     */
    public function getById($testimonialId);

    /**
     * Retrive ingredients matching the specified criteria
     * @param \Magento\Framework\Api\SearchCriteriaInterface $criteria
     * @return \Magento\Framework\Api\SearchResultsInterface
     */
    public function getList(SearchCriteriaInterface $criteria);
	
	
    /**
     * @param \Credevlabz\Testimonials\Api\Data\TestimonialInterface $testimonial
     * @return bool true on success
     */
    public function delete(\Credevlabz\Testimonials\Api\Data\TestimonialInterface $testimonial);

    /**
     * @param int $testimonialId
     * @return bool true on success
     */
    public function deleteById($testimonialId);
	
	 /**
     * @param mixed $testimonial_data
     * @return array
     */
    public function changeorder($testimonial_data);
}