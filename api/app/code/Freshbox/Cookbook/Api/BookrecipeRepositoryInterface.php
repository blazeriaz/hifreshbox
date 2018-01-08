<?php
namespace Freshbox\Cookbook\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface BookrecipeRepositoryInterface
{
    /**
     * Save cookbook_recipe.
     * @param \Freshbox\Cookbook\Api\Data\BookrecipeInterface $cookbook_recipe
     * @return \Freshbox\Cookbook\Api\Data\BookrecipeInterface
     *
     */
    public function save(\Freshbox\Cookbook\Api\Data\BookrecipeInterface  $cookbook_recipe);

    /**
     *  Slide.
     * @param int $id
     * @return \Freshbox\Cookbook\Api\Data\BookrecipeInterface
     *
     */
    public function getById($id);

  
	
    /**
     * @param Freshbox\Cookbook\Api\Data\BookrecipeInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Cookbook\Api\Data\BookrecipeInterface $page);

    /**
     * @param int $id
     * @return bool true on success
     */
    public function deleteById($id);
	
	/**
     * Return Added wishlist info.
     *
     * @param int $customerId
	 * @param mixed $cart_item 
     * @return array
     *
     */
	public function addtocartrecipe($customerId,$cart_item);
	
	/**
     * 
     *
     * @param int $customerId
	 * @param int $cookbookId
     * @return array
     *
     */
	public function getcookbookrecipes($customerId,$cookbookId);
	
	/**
     * 
     *
     * @param int $customerId
     * @param int $cartId
     * @return array
     *
     */
	public function listcartitems($customerId,$cartId);
	
	/**
     * Return Added wishlist info.
     *
     * @param int $customerId
	 * @param int $quoteId 
	 * @return array
     *
     */
	public function guesttocustomer($customerId,$quoteId);
	
	
}
