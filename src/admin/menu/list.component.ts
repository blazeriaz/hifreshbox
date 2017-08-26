import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RestService, AlertService, MealMenuService } from "services";

export const pageSize = 3;
export const filterGroups = [{
    filters : [{
        field : "attribute_set_id",
        value : 16,
        condition_type : 'eq'
    }]
}];

@Component({
    templateUrl: 'list.component.html'
})
export class MenuListComponent implements OnInit {
    private recipes:any;
    private pager: any;
    yearMonthSubs;
    showAddRecipe;

    constructor(
        private rest: RestService,
        private alert: AlertService,
        private mealMenuService: MealMenuService
        ) {
        
    }
                
    ngOnInit(): void {
        this.recipes = [];
        this.showAddRecipe = false;
        this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
            let date = new Date();
            let currentWeek = this.mealMenuService.getWeekNumber(date);
            if(date.getDay() <=5 && data.week >= currentWeek + 2) {
                this.showAddRecipe = true;
            }
            if(date.getDay() > 5 && data.week > currentWeek + 2) {
                this.showAddRecipe = true;
            }
            let sendData = {week_data : {
                sku : 'freshbox-subscription',
                week_no : data.week,
                year : data.year
            }}
            //Get recipes og Menu
            this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                this.recipes = recipes;console.log(recipes);
            });
        });
    }

    ngOnDestroy() {
        this.yearMonthSubs.unsubscribe();
    }

    removeRecipeFromMenu(menu_id) {
        if(!confirm("Are you sure to remove the recipe from menu?")) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem('', "menus/" + menu_id).subscribe(data => {
            if(data) {
                this.alert.success("The recipe remvoed successfully!", true);

                this.recipes = this.recipes.filter(function(data, i){
                    if(data.menu_id == menu_id) {
                        return false;
                    }
                    return true;
                });
            } else {
                this.alert.error("The recipe can't be deleted!", true);
            }
        });
    }
}
