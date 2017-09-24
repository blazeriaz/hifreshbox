import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { TestimonalListComponent } from './list.component';
import { TestimonalFormComponent } from "./form.component";

const routes: Routes = [
    {
        path: '',
        component: TestimonalListComponent,/**
        resolve: {
            reviews: testimonalListResolve
        },**/
        data: {
            title: 'Testimonal'
        }
    },
    {
        path: 'add',
        component: TestimonalFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:id',
        component: TestimonalFormComponent,
        data: {
            title: 'Edit'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestimonalRoutingModule {}
