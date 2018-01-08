<?php
namespace Freshbox\Cookbook\Api\Data;

interface BookInterface 
{
    const COOKBOOK_ID  = 'cookbook_id';
   
    const COOKBOOK_TITLE = 'title';
    const CREATED = 'creation_time';
    const UPDATED = 'update_time';
    const STATUS = 'is_active';
    const USER_ID = 'user_id';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $cookbookId
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setId($cookbookId);

    /**
     * get cookbook Entity 'cookbook id' property value
     * @return int|null
     */
    public function getCookbookId();

    /**
     * set Ingredient entity 'ingredient Id' property value
     * @param int $cookbookId
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setCookbookId($cookbookId);
    
    /**
     * get Ingredient 'title' property value
     * @return string|null
     */
    public function getTitle();

    /**
     * set Recipe entity 'title' property value
     * @param string $title
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setTitle($title);
	
	/**
     * get Ingredient 'created' property value
     * @return string|null
     */
    public function getCreationTime();
	
	/**
     * set Recipe entity 'created' property value
     * @param string $creation_time
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setCreationTime($creation_time);
	
	/**
     * get Ingredient 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();
	
	/**
     * set Recipe entity 'modified' property value
     * @param string $update_time
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setUpdateTime($update_time);
	
	/**
     * get Ingredient 'status' property value
     * @return int|null
     */
    public function getIsActive();
	
	/**
     * set Recipe entity 'status' property value
     * @param int $is_active
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setIsActive($is_active);
	
	/**
     * get Ingredient 'status' property value
     * @return int|null
     */
    public function getUserId();
	
	/**
     * set Recipe entity 'status' property value
     * @param int $user_id
     * @return \Freshbox\Cookbook\Model\Book 
     */
    public function setUserId($user_id);
	
	
	
}
