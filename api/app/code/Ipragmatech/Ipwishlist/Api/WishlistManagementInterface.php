<?php
/**
 * Contributor company: iPragmatech solution Pvt Ltd.
 * Contributor Author : Manish Kumar
 * Date: 23/5/16
 * Time: 11:55 AM
 */
namespace Ipragmatech\Ipwishlist\Api;

/**
 * Interface WishlistManagementInterface
 * @api
 */
interface WishlistManagementInterface
{

    /**
     * Return Wishlist items.
     *
     * @param int $customerId
     * @return array
     */
    public function getWishlistForCustomer($customerId);

    /**
     * Return Added wishlist item.
     *
     * @param int $customerId
     * @param int $productId
     * @return array
     *
     */
    public function addWishlistForCustomer($customerId,$productId);

    /**
     * Return Added wishlist item.
     *
     * @param int $customerId
     * @param int $wishlistId
     * @return status
     *
     */
    public function deleteWishlistForCustomer($customerId,$wishlistItemId);

    /**
     * Return Added wishlist info.
     *
     * @param int $customerId
     * @return array
     *
     */
    public function getWishlistInfo($customerId);
}

