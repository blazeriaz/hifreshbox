<?php
namespace Freshbox\Contact\Model;
/**
 *@api
 */
class Enquiry extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Contact\Api\Data\EnquiryInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_contact_enquiry';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Contact\Model\ResourceModel\Enquiry');
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
        return $this->getData(self::ENQUIRY_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setId($id) {
        $this->setData(self::ENQUIRY_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getEnquiryId() {
        return $this->getData(self::ENQUIRY_ID);
    }

    /**
     * @api
     * @param int $enquiryId
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setEnquiryId($enquiryId) {
        $this->setData(self::ENQUIRY_ID, $enquiryId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getEmail() {
        return $this->getData(self::ENQUIRY_EMAIL);
    }

    /**
     * @api
     * @param string $email
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setEmail($email) {
        $this->setData(self::ENQUIRY_EMAIL, $email);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getSubject() {
        return $this->getData(self::ENQUIRY_SUBJECT);
    }

    /**
     * @api
     * @param string $subject
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setSubject($subject) {
        $this->setData(self::ENQUIRY_SUBJECT, $subject);
        return $this;
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getCreationTime() {
        return $this->getData(self::ENQUIRY_CREATION);
    }

    /**
     * @api
     * @param string $creation_time
     * @return \Freshbox\Contact\Model\Enquiry 
     */
    public function setCreationTime($creation_time) {
        $this->setData(self::ENQUIRY_CREATION, $creation_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getMessage() {
        return $this->getData(self::ENQUIRY_MESSAGE);
    }

    /**
     * @api
     * @param string $message
     * @return \Freshbox\Contact\Model\Enquiry
     */
    public function setMessage($message) {
        $this->setData(self::ENQUIRY_MESSAGE, $message);
    }

	
}
