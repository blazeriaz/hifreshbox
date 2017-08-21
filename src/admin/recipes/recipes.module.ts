import { NgModule }                 from '@angular/core';

import { RecipesListComponent, recipesListResolve } from './list.component';
import { RecipesRoutingModule }   from './recipes-routing.module';
import { ProductsService } from "services";
import { CommonModule } from "@angular/common";
import { mgCatalogAttribute } from "pipes";
import { RecipeFormComponent, recipeEditResolve } from "./form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SelectModule} from 'ng2-select';
import { PagerService } from 'services/index'


@NgModule({
    imports: [
        SelectModule, RecipesRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ RecipesListComponent, RecipeFormComponent, mgCatalogAttribute ],
    providers: [ProductsService, recipesListResolve, recipeEditResolve, PagerService]
})
export class RecipesModule { }
