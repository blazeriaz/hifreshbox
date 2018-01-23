import { NgModule } from '@angular/core';
import { Routes,
         RouterModule } from '@angular/router';

import { GiftCardsListComponent } from './list.component';
import { DebitGiftCardsListComponent } from './debit-list.component';

import { FullLayoutComponent } from 'front/layouts/full-layout.component';

const routes: Routes = [
    {
        path: '',
        component: GiftCardsListComponent,
        data: {
            title: 'GiftCards'
        }
    }, 
    {
        path: 'debit',
        component: DebitGiftCardsListComponent,
        data: {
            title: 'Debit Gift Cards'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GiftCardsRoutingModule {}
