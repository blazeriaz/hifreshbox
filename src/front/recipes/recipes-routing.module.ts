import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { RecipesListComponent } from './list.component';
import { RecipeFormComponent } from "./form.component";

const routes: Routes = [
    {
        path: '',
        component: RecipesListComponent,
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
