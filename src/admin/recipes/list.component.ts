import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService } from "services";

export const pageSize = 10;
export const filterGroups = [{
    filters : [{
        field : "attribute_set_id",
        value : 16,
        condition_type : 'eq'
    }]
}];

@Injectable()
export class recipesListResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    this.rest.setRestModule('products');
    return this.rest.getItems(1, filterGroups, pageSize);
  }
}

@Component({
    templateUrl: 'list.component.html'
})
export class RecipesListComponent implements OnInit {
    private recipes:any;
    private pager: any;
    searchName;
    searchSubscripe;

    constructor(private rest: RestService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router ) {
        this.rest.setRestModule('products');
    }
                
    ngOnInit(): void {
        let recipes = this.route.snapshot.data['recipes'];        
        this.initRecipesList(recipes);
    }

    initRecipesList(recipes, page?) {
        this.recipes = recipes.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(recipes.total_count, page, pageSize);        
    }

    searchRecipeName() {
        if(this.searchName) {
            let filterGroups = [{
                filters : [{
                    field : "attribute_set_id",
                    value : 16,
                    condition_type : 'eq'
                }]
            },{
                filters : [{
                    field : "name",
                    value : "%" + this.searchName + "%",
                    condition_type : 'like'
                }]
            }];
            if(this.searchSubscripe) {
                this.searchSubscripe.unsubscribe();
            }
            this.searchSubscripe = this.rest.getItems(1, filterGroups, pageSize).subscribe(recipes => {
                this.initRecipesList(recipes, 1);
            });
        }
    }

    setPage(page) {
        this.rest.getItems(page, filterGroups, pageSize).subscribe(recipes => {
            this.initRecipesList(recipes, page);
        });
    }

    deleteReceipe(recipeSku) {
        if(!confirm("Are you sure to delete the recipe?")) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(recipeSku).subscribe(data => {
            if(data) {
                this.alert.success("The recipe deleted successfully!", true);
                this.rest.getItems(1, filterGroups, pageSize).subscribe(recipes => {
                    this.initRecipesList(recipes);
                });
            } else {
                this.alert.error("The recipe can't be deleted!", true);
            }
        });
    }
}
