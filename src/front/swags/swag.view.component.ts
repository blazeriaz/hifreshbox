import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from "global";
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'swag.view.component.html'
})
export class SwagViewComponent implements OnInit {
    backgrounds;

    loadedSwag; 
    loadedSwagMedia; 
    swag;
    swagMediaImages;
    mainImgSrc;
    zoomedImgSrc;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) { }
  
    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url('+GlobalVariable.htmlImages+'top-banner-week-menu.png)',
                'background-position' : 'bottom',
                'background-size': 'cover', 
                'background-attachment' : 'fixed',
                'background-color' : '#2F2F30'
            },
            recipe : GlobalVariable.htmlImages+'each-recipe-img.png',
            cap : GlobalVariable.htmlImages+'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages+'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages+'what-is-freshbox.png',
            gray : {
                'background-image': 'url('+GlobalVariable.htmlImages+'hiw-bg.png)',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF',
                'background-size': 'cover', 
            },
            testimonials : {
                'background-image': 'url('+GlobalVariable.htmlImages+'testimonials.png)',
                'background-size': 'cover', 
                'background-position' : 'bottom'
            },
            orders : {
                'background-image': 'url('+GlobalVariable.htmlImages+'orders-bg.png)',
                'background-size': '95% auto', 
                'background-position' : 'top left',
                'background-repeat' : 'no-repeat',
            },
            signup: {
                'background-image': 'url('+GlobalVariable.htmlImages+'newsletter-signup.png)',
                'background-size': 'cover', 
                'background-position' : 'bottom'
            }
        };

        this.renderer.addClass(document.body, 'white-header');
        this.mainImgSrc = this.backgrounds.recipe;
        this.zoomedImgSrc = this.backgrounds.recipe;
        this.loadSwag();
        this.loadMediaImages();
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }

    loadSwag() {        
        this.loadedSwag = false;
        let swagSku = this.route.snapshot.params['sku']; 
        this.rest.getItem(swagSku, "products/"+swagSku).subscribe(swag => {
            this.loadedSwag = true;
            this.swag = swag;
        });        
    }
    

    loadMediaImages() {
        let swagSku = this.route.snapshot.params['sku'];
        this.swagMediaImages = [];
        if(!swagSku) return;
        this.loadedSwagMedia = false;
        this.rest.getItem('', 'products-gal/'+swagSku+'/media')
            .subscribe(images => {
              this.swagMediaImages = images;
              this.loadedSwagMedia = true;
              if(images.length > 0) this.changeMainImage(images[0]);
            },
           error => {
               
           });
    }

    changeMainImage(image) {
        this.mainImgSrc = image.file.medium_file;
        this.zoomedImgSrc = image.file.original_file_fullpath;
    }
}