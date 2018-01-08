<?php
namespace Freshbox\Subscription\Api\Data;

interface PauseInterface 
{
    const PAUSE_ID  = 'pause_id';
   
    const WEEK_NO = 'week_no';
  
    const USERID = 'user_id';   
    const YEAR = 'year';   
  
   const START_DATE = 'start_date';
   const END_DATE = 'end_date';
   const CREATION = 'creation_time';
   const UPDATE = 'update_time';
   
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $pauseId
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setId($pauseId);

    /**
     * get Faq Entity 'faq id' property value
     * @return int|null
     */
    public function getPauseId();

    /**
     * set faq entity 'protion Id' property value
     * @param int $pauseId
     * @return \Freshbox\Subscription\Model\Pause  
     */
    public function setPauseId($pauseId);
	
	/**
     * get faq 'week_no' property value
     * @return int|null
     */
    public function getWeekNo();
	
	/**
     * set faq entity 'is_active' property value
     * @param int $week_no
     * @return \Freshbox\Subscription\Model\Pause
     */
    public function setWeekNo($week_no);
	
	
	
	/**
     * get subscription 'userid' property value
     * @return int|null
     */
    public function getUserId();

    /**
     * set faq entity 'answer' property value
     * @param int $user_id
     * @return \Freshbox\Subscription\Model\Pause 
     */
    public function setUserId($user_id);
	
	
	
	/**
     * get faq 'creation_time' property value
     * @return string|null
     */
    public function getCreationTime();

    /**
     * set faq entity 'creation_time' property value
     * @param string $creation_time
     * @return \Freshbox\Subscription\Model\Pause
     */
    public function setCreationTime($creation_time);
	
	/**
     * get faq 'creation_time' property value
     * @return string|null
     */
    public function getStartDate();

    /**
     * set faq entity 'creation_time' property value
     * @param string $start_date
     * @return \Freshbox\Subscription\Model\Pause
     */
    public function setStartDate($start_date);
	
	/**
     * get faq 'creation_time' property value
     * @return string|null
     */
    public function getEndDate();

    /**
     * set faq entity 'creation_time' property value
     * @param string $end_date
     * @return \Freshbox\Subscription\Model\Pause
     */
    public function setEndDate($end_date);
	
	
	/**
     * get faq 'year' property value
     * @return string|null
     */
    public function getYear();

    /**
     * set faq entity 'year' property value
     * @param string $year
     * @return \Freshbox\Subscription\Model\Pause
     */
    public function setYear($year);
	
	/**
     * get faq 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();

    /**
     * set faq entity 'update_time' property value
     * @param string $update_time
     * @return \Freshbox\Subscription\Model\Pause
     */
    public function setUpdateTime($update_time);
	
		
}
