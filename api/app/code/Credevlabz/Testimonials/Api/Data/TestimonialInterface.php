<?php
/* 
 * @package Credevlabz/Testimonials
 * @category Api
 * @author Aman Srivastava <http://amansrivastava.in>
 *
 */

namespace Credevlabz\Testimonials\Api\Data;


interface TestimonialInterface
{
    /**
     * Constants for keys of data array. Identical to the name of the getter in snake case
     */
    const TESTIMONIAL_ID = 'testimonial_id';
    const NAME         = 'name';
    const EMAIL         = 'email';
    const CONTENT       = 'content';
    const RATING       = 'rating';
    const CREATION_TIME = 'creation_time';
    const UPDATE_TIME   = 'update_time';
    const IS_ACTIVE     = 'is_active';
    const SORT_ORDER     = 'sort_order';

    /**
     * Get ID
     *
     * @return int|null
     */
    public function getId();
	
	 /**
     * Get ID
     *
     * @return int|null
     */
    public function getSortOrder();
	
	/**
     * get Faq Entity 'faq id' property value
     * @return int|null
     */
    public function getTestimonialId();

    /**
     * set faq entity 'protion Id' property value
     * @param int $testimonialId
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setTestimonialId($testimonialId);
	
	/**
     * get Faq Entity 'faq id' property value
     * @return int|null
     */
    public function getRating();

    /**
     * set faq entity 'protion Id' property value
     * @param int $rating
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setRating($rating);

    /**
     * Get name
     *
     * @return string|null
     */
    public function getName();

    /**
     * Get email
     *
     * @return string|null
     */
    public function getEmail();

    /**
     * Get content
     *
     * @return string|null
     */
    public function getContent();

    /**
     * Get creation time
     *
     * @return string|null
     */
    public function getCreationTime();

    /**
     * Get update time
     *
     * @return string|null
     */
    public function getUpdateTime();
	
	/**
     * Is active
     *
     * @return bool|null
     */
	
	public function getIsActive();

    /**
     * Is active
     *
     * @return bool|null
     */
    public function isActive();

    /**
     * Set ID
     *
     * @param int $id
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setId($id);
	
	/**
     * Set ID
     *
     * @param int $sort_order
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setSortOrder($sort_order);

    /**
     * Set name
     *
     * @param string $name
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setName($name);

    /**
     * Set email
     *
     * @param string $email
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setEmail($email);

    /**
     * Set content
     *
     * @param string $content
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setContent($content);

    /**
     * Set creation time
     *
     * @param string $creationTime
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setCreationTime($creationTime);

    /**
     * Set update time
     *
     * @param string $updateTime
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setUpdateTime($updateTime);

    /**
     * Set is active
     *
     * @param int|bool $isActive
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setIsActive($isActive);
}