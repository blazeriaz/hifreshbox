import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { RecipesListComponent } from './list.component';

const routes: Routes = [
    {
        path: '',
        component: RecipesListComponent,
        data: {
            title: 'Recipes'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}
