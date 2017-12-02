import { NgModule } from '@angular/core';
import { Routes,
         RouterModule } from '@angular/router';

import { CardsListComponent } from './list.component';
import { OrderViewComponent } from './view.component';
import { FullLayoutComponent } from 'front/layouts/full-layout.component';

const routes: Routes = [
    {
        path: '',
        component: CardsListComponent,
        data: {
            title: 'Cards'
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
export class CardsRoutingModule {}
