import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { RecipesListComponent, recipesListResolve } from './list.component';
import { RecipeFormComponent, recipeEditResolve } from "./form.component";

const routes: Routes = [
    {
        path: '',
        component: RecipesListComponent,
        resolve: {
            recipes: recipesListResolve
        },
        data: {
            title: 'Recipes'
        }
    },
    {
        path: 'add',
        component: RecipeFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:sku',
        component: RecipeFormComponent,
        resolve: {
            recipe: recipeEditResolve
        },
        data: {
            title: 'Edit'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}
