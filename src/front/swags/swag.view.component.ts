import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService, CartService } from 'services';

import * as GlobalVariable from 'global';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: 'swag.view.component.html'
})
export class SwagViewComponent implements OnInit, OnDestroy {
    backgrounds;

    loadedSwag;
    loadedSwagMedia;
    swag;
    swagMediaImages;
    mainImgSrc;
    zoomedImgSrc;
    swagProduct;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'top-banner-week-menu.png)',
                'background-position' : 'bottom',
                'background-size': 'cover',
                'background-attachment' : 'fixed',
                'background-color' : '#2F2F30'
            },
            recipe : GlobalVariable.htmlImages + 'each-recipe-img.png',
            cap : GlobalVariable.htmlImages + 'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages + 'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages + 'what-is-freshbox.png',
            gray : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'hiw-bg.png)',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF',
                'background-size': 'cover',
            },
            testimonials : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'testimonials.png)',
                'background-size': 'cover',
                'background-position' : 'bottom'
            },
            orders : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'orders-bg.png)',
                'background-size': '95% auto',
                'background-position' : 'top left',
                'background-repeat' : 'no-repeat',
            },
            signup: {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'newsletter-signup.png)',
                'background-size': 'cover',
                'background-position' : 'bottom'
            }
        };

        this.renderer.addClass(document.body, 'white-header');
        /**this.mainImgSrc = this.backgrounds.recipe;
        this.zoomedImgSrc = this.backgrounds.recipe;**/
        this.loadSwag();

        this.swagProduct = {cartItem: {
            quote_id: null,
            sku: null,
            qty: 1,
            productOption: null
        }};
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }

    loadSwag() {
        this.loadedSwag = false;
        const swagSku = this.route.snapshot.params['sku'];
        this.rest.getItem(swagSku, 'recipedetail/' + swagSku).subscribe(swag => {
            this.swagProduct.cartItem.sku = swag.sku;
            this.cartService.getCartTotal().subscribe(res => {
                if (res.guestCardId) {
                    this.swagProduct.cartItem.quote_id = res.guestCardId
                } else if (res.cart && res.cart.id) {
                    this.swagProduct.cartItem.quote_id = res.cart.id
                }
            });
            this.loadedSwag = true;
            this.swag = swag;
            this.loadMediaImages(swag.sku);
        });
    }

    loadMediaImages(swagSku) {
        this.swagMediaImages = [];
        if (!swagSku) {
            return;
        }
        this.loadedSwagMedia = false;
        this.rest.getItem('', 'products-gal/' + swagSku + '/media')
            .subscribe(images => {
            this.swagMediaImages = images;
            this.loadedSwagMedia = true;
            if (images.length > 0) {
                this.changeMainImage(images[0]);
            }
        },
        error => {
        });
    }

    changeMainImage(image) {
        this.mainImgSrc = image.file.medium_file;
        this.zoomedImgSrc = image.file.original_file_fullpath;
    }

    addSwagToCart() {
        this.alert.clear();
        this.cartService.addItemToCart(this.swagProduct).subscribe(res => {
            this.cartService.increaseCartItem(res);
            this.alert.success('Swag added to cart.');
        }, err => {
            const e = err.json();
            this.alert.error(e.message);
        });
    }
}
