import { Component, OnInit }    from '@angular/core';
import { Router }               from '@angular/router';
import { RecipesService } from "services";

@Component({
    templateUrl: 'form.component.html'
})
export class RecipeFormComponent implements OnInit {
    public recipe:any;

    constructor(private recipesService: RecipesService ) { }
    
    ngOnInit(): void {
    }
}
