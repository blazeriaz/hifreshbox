<?php
namespace Freshbox\Meals\Model;
/**
 *@api
 */
class Preferenceoption extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Meals\Api\Data\PreferenceoptionInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_preference_option';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Meals\Model\ResourceModel\Preferenceoption');
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
        return $this->getData(self::PREFERENCE_OPTION_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setId($id) {
        $this->setData(self::PREFERENCE_OPTION_ID, $id);
        return $this;
    }
	
	 /**
     * @api
     * @return int|null
     */
    public function getPreferenceOptionId() {
        return $this->getData(self::PREFERENCE_OPTION_ID);
    }

    /**
     * @api
     * @param int $preferenceOptionId
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setPreferenceOptionId($preferenceOptionId) {
        $this->setData(self::PREFERENCE_OPTION_ID, $preferenceOptionId);
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
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setPreferenceId($preferenceId) {
        $this->setData(self::PREFERENCE_ID, $preferenceId);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getQtyEnabled() {
        return $this->getData(self::QTY_ENABLED);
    }

    /**
     * @api
     * @param int $qty_enabled
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setQtyEnabled($qty_enabled) {
        $this->setData(self::QTY_ENABLED, $qty_enabled);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getSortOrder() {
        return $this->getData(self::SORT_ORDER);
    }

    /**
     * @api
     * @param int $sort_order
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setSortOrder($sort_order) {
        $this->setData(self::SORT_ORDER, $sort_order);
        return $this;
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsActive() {
        return $this->getData(self::IS_ACTIVE);
    }

    /**
     * @api
     * @param int $is_active
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setIsActive($is_active) {
        $this->setData(self::IS_ACTIVE, $is_active);
        return $this;
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getTitle() {
        return $this->getData(self::PREFERENCE_OPTION_NAME);
    }

    /**
     * @api
     * @param string $title
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setTitle($title) {
        $this->setData(self::PREFERENCE_OPTION_NAME, $title);
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
     * @return \Freshbox\Meals\Model\Preferenceoption 
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
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::UPDATED, $update_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getPrice() {
        return $this->getData(self::PREFERENCE_PRICE);
    }

    /**
     * @api
     * @param string $price
     * @return \Freshbox\Meals\Model\Preferenceoption 
     */
    public function setPrice($price) {
        $this->setData(self::PREFERENCE_PRICE, $price);
    }
	
		
}
