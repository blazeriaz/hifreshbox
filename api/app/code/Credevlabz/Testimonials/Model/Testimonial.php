<?php
/* 
 * @package Credevlabz/Testimonials
 * @category Model
 * @author Aman Srivastava <http://amansrivastava.in>
 *
 */

namespace Credevlabz\Testimonials\Model;

use Credevlabz\Testimonials\Api\Data\TestimonialInterface;
use Magento\Framework\DataObject\IdentityInterface;

class Testimonial  extends \Magento\Framework\Model\AbstractModel implements TestimonialInterface, IdentityInterface
{

    /**#@+
     * Testimonial's Statuses
     */
    const STATUS_ENABLED = 1;
    const STATUS_DISABLED = 0;
    /**#@-*/

    /**
     * CMS page cache tag
     */
    const CACHE_TAG = 'testimonial';

    /**
     * @var string
     */
    protected $_cacheTag = 'testimonial';

    /**
     * Prefix of model events names
     *
     * @var string
     */
    protected $_eventPrefix = 'testimonial';

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Credevlabz\Testimonials\Model\ResourceModel\Testimonial');
    }

    /**
     * Prepare testimonial's statuses.
     * Available event testimonial_get_available_statuses to customize statuses.
     *
     * @return array
     */
    public function getAvailableStatuses()
    {
        return [self::STATUS_ENABLED => __('Enabled'), self::STATUS_DISABLED => __('Disabled')];
    }
    /**
     * Return unique ID(s) for each object in system
     *
     * @return array
     */
    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * Get ID
     *
     * @return int|null
     */
    public function getId()
    {
        return $this->getData(self::TESTIMONIAL_ID);
    }
	
	/**
     * Get ID
     *
     * @return int|null
     */
    public function getSortOrder()
    {
        return $this->getData(self::SORT_ORDER);
    }
	
	/**
     * Get ID
     *
     * @return int|null
     */
	
	public function getTestimonialId(){
		 return $this->getData(self::TESTIMONIAL_ID);
	}

    /**
     * Get name
     *
     * @return string|null
     */
    public function getName()
    {
        return $this->getData(self::NAME);
    }

    /**
     * Get email
     *
     * @return string|null
     */
    public function getEmail()
    {
        return $this->getData(self::EMAIL);
    }

    /**
     * Get content
     *
     * @return string|null
     */
    public function getContent()
    {
        return $this->getData(self::CONTENT);
    }

    /**
     * Get creation time
     *
     * @return string|null
     */
    public function getCreationTime()
    {
        return $this->getData(self::CREATION_TIME);
    }

    /**
     * Get update time
     *
     * @return string|null
     */
    public function getUpdateTime()
    {
        return $this->getData(self::UPDATE_TIME);
    }
	
	public function getIsActive(){
		 return $this->getData(self::IS_ACTIVE);
	}
	
	/**
     * Get Rating
     *
     * @return int|null
     */
	public function getRating(){
		 return $this->getData(self::RATING);
	}

    /**
     * Is active
     *
     * @return bool|null
     */
    public function isActive()
    {
        return (bool) $this->getData(self::IS_ACTIVE);
    }

    /**
     * Set ID
     *
     * @param int $id
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setId($id)
    {
        return $this->setData(self::TESTIMONIAL_ID, $id);
    }
	
	 /**
     * Set ID
     *
     * @param int $sort_order
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setSortOrder($sort_order)
    {
        return $this->setData(self::SORT_ORDER, $sort_order);
    }
	
	/**
     * Set ID
     *
     * @param int $testimonialId
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
	public function setTestimonialId($testimonialId){
		 return $this->setData(self::TESTIMONIAL_ID, $testimonialId);
	}

    /**
     * Set name
     *
     * @param string $name
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setName($name)
    {
        return $this->setData(self::NAME, $name);
    }

    /**
     * Set email
     *
     * @param string $email
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setEmail($email)
    {
        return $this->setData(self::EMAIL, $email);
    }

    /**
     * Set content
     *
     * @param string $content
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setContent($content)
    {
        return $this->setData(self::CONTENT, $content);
    }

    /**
     * Set creation time
     *
     * @param string $creation_time
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setCreationTime($creation_time)
    {
        return $this->setData(self::CREATION_TIME, $creation_time);
    }

    /**
     * Set update time
     *
     * @param string $update_time
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setUpdateTime($update_time)
    {
        return $this->setData(self::UPDATE_TIME, $update_time);
    }

    /**
     * Set is active
     *
     * @param int|bool $is_active
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setIsActive($is_active)
    {
        return $this->setData(self::IS_ACTIVE, $is_active);
    }
	
	/**
     * Set rating
     *
     * @param int|bool $rating
     * @return \Credevlabz\Testimonials\Api\Data\TestimonialInterface
     */
    public function setRating($rating)
    {
        return $this->setData(self::RATING, $rating);
    }
}
