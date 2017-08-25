import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService, RestService, MealMenuService} from "services";

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
    private pager: any;

    constructor(private router: Router,
                private rest: RestService,
                private pagerService: PagerService,
                private mealMenuService: MealMenuService) {
    }
                
    ngOnInit(): void {    
        this.rest.setRestModule('products');
        this.rest.getItems(1, filterGroups, pageSize).subscribe(recipes => {
            this.initRecipesList(recipes, 1);
        });
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

    addRecipeToMenu(sku) {

    }
}
