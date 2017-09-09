import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { OrdersListComponent } from './list.component';
import { OrderViewComponent } from "./view.component";
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
        path: 'view/:id',
        component: OrderViewComponent,
        data: {
            title: 'View Order'
        }
    }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule {}
