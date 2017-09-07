import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { OrdersListComponent } from './list.component';
import { OrderFormComponent } from "./form.component";
import { FullLayoutComponent } from "../layouts/full-layout.component";
import { emptyLayoutComponent } from "../layouts/empty-layout.component";

const routes: Routes = [
    {
        path: '',
        component: OrdersListComponent,
        data: {
            title: 'Orders'
        }
    },
    {
        path: 'add',
        component: OrderFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:id',
        component: OrderFormComponent,
        data: {
            title: 'Edit'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule {}
