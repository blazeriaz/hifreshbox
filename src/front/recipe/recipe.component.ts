import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, RestService, AuthService } from 'services';

@Component({
    templateUrl: 'recipe.component.html'
})
export class RecipeComponent implements OnInit, OnDestroy {
    backgrounds;
    loadedRecipe;
    recipe;
    islogin;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private renderer: Renderer2,
        private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.islogin = this.auth.isLogin();
        this.renderer.addClass(document.body, 'white-header');
        this.backgrounds = {
            header: {
                'background-image': 'url('+GlobalVariable.htmlImages+'top-banner-single-recipe.png)',
                'background-position' : 'top left',
                'background-size': 'cover', 
                'background-repeat' : 'no-repeat'
            },
            recipe : GlobalVariable.htmlImages+'each-recipe-img.png',
            singlerecipe : GlobalVariable.htmlImages+'single-recipe.png',
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
        const recipeSku = this.route.snapshot.params['sku'];
        this.rest.getItem(recipeSku, 'recipedetail/' + recipeSku).subscribe(recipe => {
            this.loadedRecipe = true;
            this.recipe = recipe;
        });
    }

    backToMenu() {
        this.router.navigate(['menu']);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
