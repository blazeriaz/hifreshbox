import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService, AlertService, RestService, MealMenuService} from 'services';
import { FormBuilder } from '@angular/forms';

export const pageSize = 5;
export const filterGroups = [{
    filters : [{
        field : 'attribute_set_id',
        value : 16,
        condition_type : 'eq'
    }]
}];

@Component({
    templateUrl: 'recipes.component.html'
})
export class RecipesListComponent implements OnInit, OnDestroy {
    recipes: any;
    selectedRecipes: any;
    pager: any;
    yearMonthSubs;
    yearWeek;
    loadedselectedRecipes;
    searchForm;

    constructor(private router: Router,
                private rest: RestService,
                private alert: AlertService,
                private _fb: FormBuilder,
                private pagerService: PagerService,
                private mealMenuService: MealMenuService) {
    }

    ngOnInit(): void {
        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadRecipesList(1));

        this.loadRecipesList(1);

        this.loadedselectedRecipes = false;
        this.selectedRecipes = [];
        this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
            const date = new Date();
            const currentWeek = this.mealMenuService.getWeekNumber(date);
            if (date.getDay() <= 5 && data.week < currentWeek + 2) {
                // this.router.navigate(['menu']);
            }
            if(date.getDay() > 5 && data.week <= currentWeek + 2) {
                // this.router.navigate(['menu']);
            }
            this.yearWeek = data;

            // Get recipes og Menu
            const sendData = {week_data : {
                sku : 'freshbox-subscription',
                week_no : data.week,
                year : data.year
            }}
            this.loadedselectedRecipes = false;
            this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                this.selectedRecipes = recipes.map(res => res.recipe_detail.sku);
                this.loadedselectedRecipes = true;
            });
        });
    }

    ngOnDestroy() {
        this.yearMonthSubs.unsubscribe();
    }

    loadRecipesList(pageNo?) {
        const searchValues = this.searchForm.value;
        const filters = [];
        filters.push({
            filters : [{
                field : 'category_id',
                value : 41,
                condition_type : 'eq'
            }]
        });
        if (searchValues && searchValues.name) {
            filters.push({
                filters : [{
                    field : 'name',
                    value : '%' + searchValues.name + '%',
                    condition_type : 'like'
                }]
            });
        }

        const sortOrders = [{
            field: 'created_at',
            direction: 'DESC'
        }];

        this.rest.getItems(pageNo, filters, pageSize, 'products', false, sortOrders).subscribe(recipes => {
            this.initRecipesList(recipes, pageNo);
        });
    }

    initRecipesList(recipes, page?) {
        this.recipes = recipes.items;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(recipes.total_count, page, pageSize);
    }

    setPage(page) {
        this.loadRecipesList(page);
    }

    goToBack() {
        this.router.navigate(['/', 'meal', 'menu']);
    }

    addRecipeToMenu(recipe_sku) {
        const sendData = {menu : {
            product_sku : 'freshbox-subscription',
            week_no : this.yearWeek.week,
            week_year : this.yearWeek.year,
            recipe_sku : recipe_sku,
            menu_type : 'week'
        }};
        this.alert.clear();
        this.rest.saveItem('', sendData, 'menu').subscribe(data => {
            this.selectedRecipes.push(recipe_sku);
            this.alert.success('The recipe added to menu successfully!', true);
        });
    }
}
