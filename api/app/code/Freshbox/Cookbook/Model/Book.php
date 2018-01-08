<?php
namespace Freshbox\Cookbook\Model;
/**
 *@api
 */
class Book extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Cookbook\Api\Data\BookInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_cookbook_book';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Cookbook\Model\ResourceModel\Book');
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
        return $this->getData(self::COOKBOOK_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setId($id) {
        $this->setData(self::COOKBOOK_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getCookbookId() {
        return $this->getData(self::COOKBOOK_ID);
    }

    /**
     * @api
     * @param int $cookbookId
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setCookbookId($cookbookId) {
        $this->setData(self::COOKBOOK_ID, $cookbookId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getTitle() {
        return $this->getData(self::COOKBOOK_TITLE);
    }

    /**
     * @api
     * @param string $title
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setTitle($title) {
        $this->setData(self::COOKBOOK_TITLE, $title);
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
     * @return \Freshbox\Cookbook\Model\Book 
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
     * @return \Freshbox\Cookbook\Model\Book 
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
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setIsActive($is_active) {
        $this->setData(self::STATUS, $is_active);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getUserId() {
        return $this->getData(self::USER_ID);
    }

    /**
     * @api
     * @param int $user_id
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setUserId($user_id) {
        $this->setData(self::USER_ID, $user_id);
    }
	
	
}
