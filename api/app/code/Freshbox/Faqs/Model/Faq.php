<?php
namespace Freshbox\Faqs\Model;
/**
 *@api
 */
class Faq extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Faqs\Api\Data\FaqInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_faqs_faq';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Faqs\Model\ResourceModel\Faq');
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
        return $this->getData(self::FAQ_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setId($id) {
        $this->setData(self::FAQ_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getFaqId() {
        return $this->getData(self::FAQ_ID);
    }

    /**
     * @api
     * @param int $faqId
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setFaqId($faqId) {
        $this->setData(self::FAQ_ID, $faqId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getQuestion() {
        return $this->getData(self::FAQ_QUESTION);
    }

    /**
     * @api
     * @param string $question
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setQuestion($question) {
        $this->setData(self::FAQ_QUESTION, $question);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getAnswer() {
        return $this->getData(self::FAQ_ANSWER);
    }

    /**
     * @api
     * @param string $answer
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setAnswer($answer) {
        $this->setData(self::FAQ_ANSWER, $answer);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getIsActive() {
        return $this->getData(self::FAQ_STATUS);
    }

    /**
     * @api
     * @param int $is_active
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setIsActive($is_active) {
        $this->setData(self::FAQ_STATUS, $is_active);
        return $this;
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getCreationTime() {
        return $this->getData(self::FAQ_CREATION);
    }

    /**
     * @api
     * @param string $creation_time
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setCreationTime($creation_time) {
        $this->setData(self::FAQ_CREATION, $creation_time);
    }
	
	/**
     * @api
     * @return string|null
     */
    public function getUpdateTime() {
        return $this->getData(self::FAQ_UPDATE);
    }

    /**
     * @api
     * @param string $update_time
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setUpdateTime($update_time) {
        $this->setData(self::FAQ_UPDATE, $update_time);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getSortOrder() {
        return $this->getData(self::FAQ_SORT);
    }

    /**
     * @api
     * @param int $sort_order
     * @return \Freshbox\Faqs\Model\Faq 
     */
    public function setSortOrder($sort_order) {
        $this->setData(self::FAQ_SORT, $sort_order);
        return $this;
    }

	
}
