<?php
namespace Credevlabz\Testimonials\Api\Data;

interface TestimonialSearchResultsInterface extends \Magento\Framework\Api\SearchResultsInterface {
    /*
     * Get slide list
     *
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface[]
     */
    public function getItems();

    /*
     * set slide list
     *
     * @param \Credevlabz\Testimonials\Api\Data\TestimonialInterface[]
     * @return $this
     */
    public function setItems(array $items);

}
