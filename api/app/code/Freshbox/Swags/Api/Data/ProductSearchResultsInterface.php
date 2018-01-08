<?php
/**
 *
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Freshbox\Swags\Api\Data;

/**
 * @api
 */
interface ProductSearchResultsInterface extends \Freshbox\Swag\Api\SearchResultsInterface
{
    /**
     * Get attributes list.
     *
     * @return \Freshbox\Swags\Api\Data\ProductInterface[]
     */
    public function getItems();

    /**
     * Set attributes list.
     *
     * @param \Freshbox\Swags\Api\Data\ProductInterface[] $items
     * @return $this
     */
    public function setItems(array $items);
}
