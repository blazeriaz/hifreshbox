<?php
namespace Freshbox\Portions\Model;
/**
 *@api
 */
class Quantity extends \Magento\Framework\Model\AbstractModel implements \Freshbox\Portions\Api\Data\QuantityInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'freshbox_portions_quantity';

    protected function _construct()
    {
        /* _init($resourceModel)  */
        $this->_init('Freshbox\Portions\Model\ResourceModel\Quantity');
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
        return $this->getData(self::PORTION_ID);
    }

    /**
     * @api
     * @param int $id
     * @return \Freshbox\Portions\Model\Quantity 
     */
    public function setId($id) {
        $this->setData(self::PORTION_ID, $id);
        return $this;
    }

    /**
     * @api
     * @return int|null
     */
    public function getPortionId() {
        return $this->getData(self::PORTION_ID);
    }

    /**
     * @api
     * @param int $portionId
     * @return \Freshbox\Portions\Model\Quantity 
     */
    public function setPortionId($portionId) {
        $this->setData(self::PORTION_ID, $portionId);
        return $this;
    }

    /**
     * @api
     * @return string|null
     */
    public function getTitle() {
        return $this->getData(self::PORTION_TITLE);
    }

    /**
     * @api
     * @param string $title
     * @return \Freshbox\Portions\Model\Quantity 
     */
    public function setTitle($title) {
        $this->setData(self::PORTION_TITLE, $title);
    }
	
	/**
     * @api
     * @return int|null
     */
    public function getStatus() {
        return $this->getData(self::PORTION_STATUS);
    }

    /**
     * @api
     * @param int $status
     * @return \Freshbox\Portions\Model\Quantity 
     */
    public function setStatus($status) {
        $this->setData(self::PORTION_STATUS, $status);
        return $this;
    }

	
}
