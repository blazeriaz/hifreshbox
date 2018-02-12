import { Component, OnInit, OnDestroy, Renderer2, HostListener } from '@angular/core';
import { RestService, AlertService, CartService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: 'swag.view.component.html'
})
export class SwagViewComponent implements OnInit, OnDestroy {
    backgrounds;

    loadedSwag;
    errorSwag;
    loadedSwagMedia;
    swag;
    swagMediaImages;
    mainImgSrc;
    zoomedImgSrc;
    swagProduct;
    allowImageZoom;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.allowZoom();
    }

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private auth: AuthService,
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

    allowZoom() {
        if(window.innerWidth < 768) {
            this.allowImageZoom = false;
        } else {
            this.allowImageZoom = true;
        }
    }

    loadSwag() {
        this.loadedSwag = false;
        this.errorSwag = false;
        const swagSku = this.route.snapshot.params['sku'];
        this.rest.showLoader();
        this.rest.getItem(swagSku, 'recipedetail/' + swagSku).subscribe(swag => {console.log(swag);
            if(swag[0] === 'error' || (swag.status === 2 && !this.auth.isAdminLogin())) {
                this.rest.hideLoader();
                this.alert.error("Swag information does not exists!");   
                this.errorSwag = true;
                this.router.navigate(['/', '404']);
                return;
            }
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
            this.rest.hideLoader();
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
            if (images.length > 1) {
                this.changeMainImage(images[1]);
            }
            if (images.length > 0) {                
                setTimeout(() => {
                    this.changeMainImage(images[0]);
                }, 1500);
            }
        },
        error => {
        });
    }

    changeMainImage(image) {
        this.allowImageZoom = false;
        setTimeout(() => {
            this.mainImgSrc = image.file.medium_file;
            this.zoomedImgSrc = image.file.original_file_fullpath;
            this.allowZoom();
        }, 100);        
    }

    addSwagToCart() {
        this.alert.clear();
        this.rest.showLoader();
        this.cartService.addItemToCart(this.swagProduct).subscribe(res => {
            this.cartService.increaseCartItem(res);
            this.alert.success('Swag added to cart.');
            this.rest.hideLoader();
        }, err => {
            const e = err.json();
            this.alert.error(e.message);
            this.rest.hideLoader();
        });
    }
}
