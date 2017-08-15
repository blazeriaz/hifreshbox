import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { UsersListComponent, customerListResolve } from './list.component';
import { UserFormComponent, customerEditResolve } from "./form.component";
import { FullLayoutComponent } from "../layouts/full-layout.component";
import { emptyLayoutComponent } from "../layouts/empty-layout.component";

const routes: Routes = [
    {
        path: '',
        component: emptyLayoutComponent,
        data: {
            title: 'Users'
        },
        children: [
            {
                path: '',
                component: UsersListComponent,
                resolve: {
                    users: customerListResolve
                },
                data: {
                    title: 'List'
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
                resolve: {
                    user: customerEditResolve
                },
                data: {
                    title: 'Edit'
                }
            }
        ]
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
