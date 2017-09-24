import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, RestService } from 'services';

@Component({
    templateUrl: 'recipe.component.html'
})
export class RecipeComponent implements OnInit {
    backgrounds;
    loadedRecipe;
    recipe;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url('+GlobalVariable.htmlImages+'top-banner-single-recipe.png)',
                'background-position' : 'top left',
                'background-size': 'cover', 
                'background-repeat' : 'no-repeat',
                'min-height' : '90vh'
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
        this.loadRecipe();
    }
    
    loadRecipe() {        
        this.loadedRecipe = false;
        let recipeSku = this.route.snapshot.params['sku']; 
        this.rest.getItem(recipeSku, "products/"+recipeSku).subscribe(recipe => {
            this.loadedRecipe = true;
            this.recipe = recipe;
        });        
    }

    backToMenu() {
        this.router.navigate(['menu']);
    }
}
