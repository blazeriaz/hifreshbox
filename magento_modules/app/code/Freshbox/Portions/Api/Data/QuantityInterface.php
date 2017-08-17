<?php
namespace Freshbox\Portions\Api\Data;

interface QuantityInterface 
{
    const PORTION_ID  = 'portion_id';
   
    const PORTION_TITLE = 'title';
   
   const PORTION_STATUS = 'status';
   

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
     * get Portion 'status' property value
     * @return int|null
     */
    public function getStatus();
	
	/**
     * set Portion entity 'status' property value
     * @param int $status
     * @return \Freshbox\portionId\Model\Quantity 
     */
    public function setStatus($status);
	
	
}
