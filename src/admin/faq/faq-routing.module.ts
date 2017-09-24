import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { FaqListComponent } from './list.component';
import { FaqFormComponent } from "./form.component";

const routes: Routes = [
    {
        path: '',
        component: FaqListComponent,
        data: {
            title: 'Faq'
        }
    },
    {
        path: 'add',
        component: FaqFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:id',
        component: FaqFormComponent,
        data: {
            title: 'Edit'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FaqRoutingModule {}
