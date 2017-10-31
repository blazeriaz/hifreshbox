import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { IngredientsListComponent, IngredientListResolve } from './ingredients';
import { FullLayoutComponent } from "../layouts/full-layout.component";
import { emptyLayoutComponent } from "../layouts/empty-layout.component";
import { PortionsListComponent, PortionListResolve } from "./portions";

const routes: Routes = [
    {
        path: '',
        component: emptyLayoutComponent,
        data: {
            title: 'Masters'
        },
        children:[{
            path: 'ingredients',
            component: IngredientsListComponent,
            resolve: {
                items: IngredientListResolve
            },
            data: {
                title: 'Ingredients'
            }
        },
        {
            path: 'portions',
            component: PortionsListComponent,
            resolve: {
                items: PortionListResolve
            },
            data: {
                title: 'Portions'
            }
        }]
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterRoutingModule {}
