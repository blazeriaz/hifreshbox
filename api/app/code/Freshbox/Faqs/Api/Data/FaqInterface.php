<?php
namespace Freshbox\Faqs\Api\Data;

interface FaqInterface 
{
    const FAQ_ID  = 'faq_id';
   
    const FAQ_QUESTION = 'question';
    const FAQ_ANSWER = 'answer';
   
   const FAQ_STATUS = 'is_active';
   const FAQ_CREATION = 'creation_time';
   const FAQ_UPDATE = 'update_time';
   const FAQ_SORT = 'sort_order';
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $faqId
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setId($faqId);

    /**
     * get Faq Entity 'faq id' property value
     * @return int|null
     */
    public function getFaqId();

    /**
     * set faq entity 'protion Id' property value
     * @param int $faqId
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setFaqId($faqId);
    
    /**
     * get faq 'question' property value
     * @return string|null
     */
    public function getQuestion();

    /**
     * set faq entity 'question' property value
     * @param string $question
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setQuestion($question);
	
	/**
     * get faq 'answer' property value
     * @return string|null
     */
    public function getAnswer();

    /**
     * set faq entity 'answer' property value
     * @param string $answer
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setAnswer($answer);
	
	 /**
     * get faq 'is_active' property value
     * @return int|null
     */
    public function getIsActive();
	
	/**
     * set faq entity 'is_active' property value
     * @param int $is_active
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setIsActive($is_active);
	
	/**
     * get faq 'creation_time' property value
     * @return string|null
     */
    public function getCreationTime();

    /**
     * set faq entity 'creation_time' property value
     * @param string $creation_time
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setCreationTime($creation_time);
	
	/**
     * get faq 'update_time' property value
     * @return string|null
     */
    public function getUpdateTime();

    /**
     * set faq entity 'update_time' property value
     * @param string $update_time
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setUpdateTime($update_time);
	
	/**
     * get faq 'sort_order' property value
     * @return int|null
     */
    public function getSortOrder();
	
	/**
     * set faq entity 'sort_order' property value
     * @param int $sort_order
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setSortOrder($sort_order);
	
	
}
