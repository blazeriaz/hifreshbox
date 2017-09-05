import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService, AlertService, RestService, MealMenuService} from "services";

export const pageSize = 5;
export const filterGroups = [{
    filters : [{
        field : "attribute_set_id",
        value : 16,
        condition_type : 'eq'
    }]
}];

@Component({
    templateUrl: 'recipes.component.html'
})
export class RecipesListComponent implements OnInit {
    private recipes:any;
    private selectedRecipes:any;
    private pager: any;
    yearMonthSubs;
    yearWeek;
    loadedselectedRecipes;

    constructor(private router: Router,
                private rest: RestService,
                private alert: AlertService,
                private pagerService: PagerService,
                private mealMenuService: MealMenuService) {
    }
                
    ngOnInit(): void {    
        this.rest.setRestModule('products');
        this.rest.getItems(1, filterGroups, pageSize).subscribe(recipes => {
            this.initRecipesList(recipes, 1);
        });

        this.loadedselectedRecipes = false;
        this.selectedRecipes = [];
        this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
            let date = new Date();
            let currentWeek = this.mealMenuService.getWeekNumber(date);
            if(date.getDay() <=5 && data.week < currentWeek + 2) {
                //this.router.navigate(['menu']);
            }
            if(date.getDay() > 5 && data.week <= currentWeek + 2) {
                //this.router.navigate(['menu']);
            }
            this.yearWeek = data;

            //Get recipes og Menu
            let sendData = {week_data : {
                sku : 'freshbox-subscription',
                week_no : data.week,
                year : data.year
            }}
            this.loadedselectedRecipes = false;
            this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                this.selectedRecipes = recipes.map(data=>data.recipe_detail.sku);
                this.loadedselectedRecipes = true;
            });
        });
    }

    ngOnDestroy() {
        this.yearMonthSubs.unsubscribe();
    }

    initRecipesList(recipes, page?) {
        this.recipes = recipes.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(recipes.total_count, page, pageSize);        
    }

    setPage(page) {
        this.rest.getItems(page, filterGroups, pageSize).subscribe(recipes => {            
            this.initRecipesList(recipes, page);
        });
    }

    goToBack() {
        this.router.navigate(['menu']);
    }

    addRecipeToMenu(recipe_sku) {
        let sendData = {menu : {
            product_sku : 'freshbox-subscription',
            week_no : this.yearWeek.week,
            week_year : this.yearWeek.year, 
            recipe_sku : recipe_sku,
            menu_type : 'week'
        }};
        this.alert.clear();
        this.rest.saveItem('', sendData, 'menu').subscribe(data => {
            this.selectedRecipes.push(recipe_sku);
            this.alert.success("The recipe added to menu successfully!", true);
        });
    }
}
