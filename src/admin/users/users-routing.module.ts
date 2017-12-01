import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { UsersListComponent } from './list.component';
import { UserFormComponent } from "./form.component";
import { MealComponent } from "./meal.component";
import { FullLayoutComponent } from "../layouts/full-layout.component";
import { emptyLayoutComponent } from "../layouts/empty-layout.component";

const routes: Routes = [
    {
        path: '',
        component: UsersListComponent,
        data: {
            title: 'Users'
        }
    },
    {
        path: 'add',
        component: UserFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:id',
        component: UserFormComponent,
        data: {
            title: 'Edit'
        }
    },
    {
        path: 'edit/:id/preference',
        component: MealComponent,
        data: {
            title: 'Edit Meal Preference'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
