import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, AlertService, MealMenuService } from 'services';

import * as GlobalVariable from "global";

@Component({
  templateUrl: 'menu.component.html'
})
export class MenuComponent implements OnInit {
  backgrounds;

  startYear;
  endYear;
  currentYear;
  selectedWeek;
  yearMonthSubs;
  disablePreviousWeek;
  disableNextWeek;
  loadRecipesSub;
  loadedselectedRecipes;
  recipes;
  selectedRecipe;

  constructor(
    private alert: AlertService,
    private rest: RestService, 
    private mealMenuService: MealMenuService
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

        let date = new Date();
        this.currentYear = date.getFullYear();  
        this.startYear = 2017;
        this.endYear = this.currentYear + 10;

        this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
            let tuesday = this.mealMenuService.getDateOfISOWeekStringFull(data.week, data.year);
            this.selectedWeek = {id: data.week, text: tuesday, year: data.year};
            
            this.disablePreviousWeek = false;      
            let prevTuesday = this.mealMenuService.getDateOfISOWeekString(data.week - 1, data.year);
            if(data.year == this.startYear && !prevTuesday) {
                this.disablePreviousWeek = true;
            }
        
            this.disableNextWeek = false;
            let nextTuesday = this.mealMenuService.getDateOfISOWeekString(data.week + 1, data.year);
            if(data.year == this.endYear && !nextTuesday) {
                this.disableNextWeek = true;
            }
            //Get recipes og Menu
            let sendData = {week_data : {
                sku : 'freshbox-subscription',
                week_no : data.week,
                year : data.year
            }}
            this.loadedselectedRecipes = false;
            if(this.loadRecipesSub) {
                this.loadRecipesSub.unsubscribe();
            }
            this.loadRecipesSub = this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                this.recipes = recipes.map(data => data.recipe_detail);
                this.loadedselectedRecipes = true;
            });
        });
    }

    ngOnDestroy() {
        this.yearMonthSubs.unsubscribe();
    }

    selectRecipe(sku) {
        this.selectedRecipe = this.recipes.filter(data => data.sku == sku)[0];
        window.scrollTo(0,0);
    }

    backToMenu(event) {
        this.selectedRecipe = null;
    }
    
    gotToPrevWeek() {
        let prevTuesday = this.mealMenuService.getDateOfISOWeek(this.selectedWeek.id - 1, this.selectedWeek.year);
        if(!prevTuesday) {
            return;
        }
        let prevWeek = this.mealMenuService.getWeekNumber(prevTuesday);
        this.mealMenuService.setYearWeek(prevTuesday.getFullYear(), prevWeek);
    }

    gotToNextWeek() {
        let nextTuesday = this.mealMenuService.getDateOfISOWeek(this.selectedWeek.id + 1, this.selectedWeek.year);
        if(!nextTuesday) {
            return;
        }
        let nextWeek = this.mealMenuService.getWeekNumber(nextTuesday);
        this.mealMenuService.setYearWeek(nextTuesday.getFullYear(), nextWeek);
    }
}
