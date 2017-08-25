import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService, MealMenuService } from "services";

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

    constructor(
        private rest: RestService,
        private mealMenuService: MealMenuService
        ) {
        this.rest.setRestModule('products');
    }
                
    ngOnInit(): void {
        this.rest.getItems(1, filterGroups, pageSize).subscribe(recipes => {
            this.initRecipesList(recipes, 1);
        });
    }

    initRecipesList(recipes, page?) {
        this.recipes = recipes.items;    
    }

    removeRecipeFromMenu(sku) {

    }
}
