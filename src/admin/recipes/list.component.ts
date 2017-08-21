import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, PagerService } from "services";

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
  
  constructor(private recipesService: ProductsService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.recipesService.getProducts(1, filterGroups, pageSize);
  }
}

@Component({
    templateUrl: 'list.component.html'
})
export class RecipesListComponent implements OnInit {
    private recipes:any;
    private pager: any;

    constructor(private recipesService: ProductsService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router ) { }
                
    ngOnInit(): void {
        let recipes = this.route.snapshot.data['recipes'];        
        this.initRecipesList(recipes);
    }

    initRecipesList(recipes, page?) {
        this.recipes = recipes.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(recipes.total_count, page, pageSize);
        console.log(this.pager);
    }

    setPage(page) {
        this.recipesService.getProducts(page, filterGroups, pageSize).subscribe(recipes => {
            this.initRecipesList(recipes, page);
        });
    }

    deleteReceipe(recipeSku) {
        if(!confirm("Are you sure to delete the recipe?")) {
            return;
        }
        this.alert.clear();
        this.recipesService.deleteProduct(recipeSku).subscribe(data => {
            if(data) {
                this.alert.success("The recipe deleted successfully!", true);
                this.recipesService.getProducts(1, filterGroups, pageSize).subscribe(recipes => {
                    this.initRecipesList(recipes);
                });
            } else {
                this.alert.error("The recipe can't be deleted!", true);
            }
        });
    }
}
