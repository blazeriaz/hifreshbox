import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { SwagsListComponent, swagsListResolve } from './list.component';
import { SwagFormComponent, swagEditResolve } from "./form.component";

const routes: Routes = [
    {
        path: '',
        component: SwagsListComponent,
        resolve: {
            swags: swagsListResolve
        },
        data: {
            title: 'Swags'
        }
    },
    {
        path: 'add',
        component: SwagFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:sku',
        component: SwagFormComponent,
        resolve: {
            swag: swagEditResolve
        },
        data: {
            title: 'Edit'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SwagsRoutingModule {}
