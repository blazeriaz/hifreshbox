import { Component, OnInit }    from '@angular/core';
import { Router }               from '@angular/router';
import { RecipesService } from "services";

@Component({
    templateUrl: 'list.component.html'
})
export class RecipesListComponent implements OnInit {
    public recipes:any;

    constructor(private recipesService: RecipesService ) { }
    
    ngOnInit(): void {
        this.recipesService.getRecipes().subscribe(
            data => {
                this.recipes = data.items;
            }
        );
    }
}
