import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { UsersListComponent }   from './list.component';

const routes: Routes = [
    {
        path: '',
        component: UsersListComponent,
        data: {
            title: 'Users'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
