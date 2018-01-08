<?php
namespace Freshbox\Contact\Api\Data;

interface EnquiryInterface 
{
    const ENQUIRY_ID  = 'enquiry_id';
   
    const ENQUIRY_EMAIL = 'email';
   
   const ENQUIRY_SUBJECT = 'subject';
   
    const ENQUIRY_MESSAGE = 'message';
	
   const ENQUIRY_CREATION = 'creation_time';
  
   

    /**
     * @api 
     * @return int|null
     */
    public function getId();

    /**
     * @api 
     *
     * @param int $enquiryId
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setId($enquiryId);

    /**
     * get Enquiry Entity 'enquiry id' property value
     * @return int|null
     */
    public function getEnquiryId();

    /**
     * set Portion entity 'protion Id' property value
     * @param int $enquiryId
     * @return \Freshbox\Contact\Model\Enquiry
     */
    public function setEnquiryId($enquiryId);
    
    /**
     * get Portion 'email' property value
     * @return string|null
     */
    public function getEmail();

    /**
     * set Portion entity 'title' property value
     * @param string $email
     * @return \Freshbox\Contact\Model\Enquiry
     */
    public function setEmail($email);
	
	 /**
     * get Enquiry 'subject' property value
     * @return string|null
     */
    public function getSubject();
	
	/**
     * set Portion entity 'subject' property value
     * @param string $subject
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setSubject($subject);
	
	/**
     * get Portion 'creation_time' property value
     * @return string|null
     */
    public function getCreationTime();

    /**
     * set Portion entity 'creation_time' property value
     * @param int $creation_time
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setCreationTime($creation_time);
	
	/**
     * get Enquiry 'update_time' property value
     * @return string|null
     */
    public function getMessage();

    /**
     * set Enquiry entity 'message' property value
     * @param string $message
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setMessage($message);
	
	
}
