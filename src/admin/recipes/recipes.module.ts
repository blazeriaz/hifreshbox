import { NgModule }                 from '@angular/core';

import { RecipesListComponent }       from './list.component';
import { RecipesRoutingModule }   from './recipes-routing.module';
import { RecipesService } from "services";
import { CommonModule } from "@angular/common";
import { mgCatalogAttribute } from "pipes";
import { RecipeFormComponent } from "./form.component";


@NgModule({
    imports: [
        RecipesRoutingModule, CommonModule
    ],
    declarations: [ RecipesListComponent, RecipeFormComponent, mgCatalogAttribute ],
    providers: [RecipesService]
})
export class RecipesModule { }
