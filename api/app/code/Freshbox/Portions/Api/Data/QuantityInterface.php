<?php
namespace Freshbox\Portions\Api\Data;

interface QuantityInterface 
{
    const PORTION_ID  = 'portion_id';
   
    const PORTION_TITLE = 'title';
   
   const PORTION_STATUS = 'is_active';
   const PORTION_CREATION = 'creation_time';
   const PORTION_UPDATE = 'update_time';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $portionId
     * @return \Freshbox\Portions\Model\Quantity 
     */
    public function setId($portionId);

    /**
     * get Portion Entity 'portion id' property value
     * @return int|null
     */
    public function getPortionId();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $portionId
     * @return \Freshbox\Portions\Model\Quantity 
     */
    public function setPortionId($portionId);
    
    /**
     * get Portion 'title' property value
     * @return string|null
     */
    public function getTitle();

    /**
     * set Portion entity 'title' property value
     * @param int $title
     * @return \Freshbox\portionId\Model\Quantity 
     */
    public function setTitle($title);
	
	 /**
     * get Portion 'is_active' property value
     * @return int|null
     */
    public function getIsActive();
	
	/**
     * set Portion entity 'is_active' property value
     * @param int $is_active
     * @return \Freshbox\portionId\Model\Quantity 
     */
    public function setIsActive($is_active);
	
	/**
     * get Portion 'creation_time' property value
     * @return string|null
     */
    public function getCreationTime();

    /**
     * set Portion entity 'creation_time' property value
     * @param int $creation_time
     * @return \Freshbox\portionId\Model\Quantity 
     */
    public function setCreationTime($creation_time);
	
	/**
     * get Portion 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();

    /**
     * set Portion entity 'update_time' property value
     * @param int $update_time
     * @return \Freshbox\portionId\Model\Quantity 
     */
    public function setUpdateTime($update_time);
	
	
}
