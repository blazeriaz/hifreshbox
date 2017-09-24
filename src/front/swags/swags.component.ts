import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from "global";
import { Router } from '@angular/router';

@Component({
  templateUrl: 'swags.component.html'
})
export class SwagsComponent implements OnInit {
  backgrounds;
  
  loadedSwagsList; 
  swags;

  constructor(
    private alert: AlertService,
    private rest: RestService,
    private router: Router
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

        this.loadSwagsList();
    }

    ngOnDestroy() {
        
    }
    loadSwagsList(pageNo?) {
        let filters = [];
        let iniFilter = {
            filters : [{
                field : "attribute_set_id",
                value : 17,
                condition_type : 'eq'
            }]
        };
        filters.push(iniFilter);
        
        this.loadedSwagsList = false;
        pageNo = pageNo?pageNo:1;
        this.rest.getItems(pageNo, filters, 100, "products").subscribe(swags => {
            this.loadedSwagsList = true;
            this.swags = swags.items;
        });        
    }

    goToSwag(sku) {
        this.router.navigate(['swags', sku]);        
    }
}
