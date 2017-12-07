import { NgModule } from '@angular/core';
import { Routes,
         RouterModule } from '@angular/router';

import { CardsListComponent } from './list.component';
import { FullLayoutComponent } from 'front/layouts/full-layout.component';

const routes: Routes = [
    {
        path: '',
        component: CardsListComponent,
        data: {
            title: 'Cards'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CardsRoutingModule {}
