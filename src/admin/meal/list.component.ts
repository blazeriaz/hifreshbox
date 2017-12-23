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
    recipes:any;
    pager: any;
    yearMonthSubs;
    disableEdit;
    loading;

    constructor(
        private rest: RestService,
        private alert: AlertService,
        private router: Router,
        private mealMenuService: MealMenuService
        ) {
        
    }
                
    ngOnInit(): void {
        this.recipes = [];
        this.disableEdit = true;        
        const date = new Date();
        const currentWeek = this.mealMenuService.getWeekNumber(date);
        this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
            console.log(data.week, currentWeek, date.getFullYear(), data.year)
            if(data.week >= currentWeek || date.getFullYear() < data.year) {
                this.disableEdit = false;
            }

            let sendData = {week_data : {
                sku : 'freshbox-subscription',
                week_no : data.week,
                year : data.year
            }}
            //Get recipes of Menu
            this.loading = true;
            this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                this.recipes = recipes;
                this.loading = false;
            }, e => this.loading = false);
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
        this.loading = true;
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
                this.alert.error("The recipe can't be removed!", true);
            }            
            this.loading = false
        }, e => this.loading = false);
    }
}
