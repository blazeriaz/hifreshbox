import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { SwagsListComponent } from './list.component';
import { SwagFormComponent } from "./form.component";

const routes: Routes = [
    {
        path: '',
        component: SwagsListComponent,
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
