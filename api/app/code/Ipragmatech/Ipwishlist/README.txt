		==Wishlist Api==

==Installation and Configuration==

1. Download the package
2. Copy and paste under Magento root directory, folder structure should be like this
3. magento_root/app/code/Ipragmatech/Ipwishlist
4. Go to the Magento root directory from your terminal
5. Run the command : sudo php bin/magento setup:upgrade
6. Delete the di, generation and cache from var/
7. Run the command: sudo php bin/magento setup:di:compile
8. Run the command: sudo php bin/magento cache:clean
9. Give the read and execute permission var/di, var/generation, var/cache


==urls==
1. Get wishlist of cusomer

url: http://mymagento.com/V1/ipwishlist/items

2. Add itmes to wishlist

url: http://mymagento.com//V1/ipwishlist/add/{productId}

3. Remove items from wishlist

url: http://mymagento.com/V1/ipwishlist/delete/{wishlistItemId}

4. Get item count of wishlist

url: http://mymagento.com/V1/ipwishlist/info