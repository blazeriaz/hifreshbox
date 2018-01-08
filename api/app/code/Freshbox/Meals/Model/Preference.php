<?php
namespace Freshbox\Meals\Model;
/**
 *@api
 */
class Preference extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Meals\Api\Data\PreferenceInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_meals_preference';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Meals\Model\ResourceModel\Preference');
    }

    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * @api
     * @return int|null
     */
    public function getId() {
        return $this->getData(self::PREFERENCE_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setId($id) {
        $this->setData(self::PREFERENCE_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getPreferenceId() {
        return $this->getData(self::PREFERENCE_ID);
    }

    /**
     * @api
     * @param int $preferenceId
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setPreferenceId($preferenceId) {
        $this->setData(self::PREFERENCE_ID, $preferenceId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getTitle() {
        return $this->getData(self::PREFERENCE_TITLE);
    }

    /**
     * @api
     * @param string $title
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setTitle($title) {
        $this->setData(self::PREFERENCE_TITLE, $title);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getCreationTime() {
        return $this->getData(self::CREATED);
    }

    /**
     * @api
     * @param string $creation_time
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setCreationTime($creation_time) {
        $this->setData(self::CREATED, $creation_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getUpdateTime() {
        return $this->getData(self::UPDATED);
    }

    /**
     * @api
     * @param string $update_time
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATED, $update_time);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsActive() {
        return $this->getData(self::STATUS);
    }

    /**
     * @api
     * @param int $is_active
     * @return \Freshbox\Meals\Model\Preference 
     */
    public function setIsActive($is_active) {
        $this->setData(self::STATUS, $is_active);
    }
	
	
}
