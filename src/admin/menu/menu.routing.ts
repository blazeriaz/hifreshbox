import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { MenuComponent } from './menu.component';
import { MenuListComponent } from "./list.component";
import { RecipesListComponent } from "./recipes.component";

const routes: Routes = [
    {
        path: '',
        component: MenuComponent,
        data: {
            title: 'Menu'
        },
        children: [
            {
                path: '',
                component: MenuListComponent,
            },
            {
                path: 'add-recipe',
                component: RecipesListComponent
            }
        ]
    }
    
];
 
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MenuRoutingModule {}
