import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { NewslettersListComponent } from './list.component';

const routes: Routes = [
    {
        path: '',
        component: NewslettersListComponent,/**
        resolve: {
            newsletters: newslettersListResolve
        },**/
        data: {
            title: 'Newsletters'
        }
    }     
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewslettersRoutingModule {}
