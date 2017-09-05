import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { ReviewsListComponent } from './list.component';
import { ReviewFormComponent, reviewEditResolve } from "./form.component";

const routes: Routes = [
    {
        path: '',
        component: ReviewsListComponent,/**
        resolve: {
            reviews: reviewsListResolve
        },**/
        data: {
            title: 'Reviews'
        }
    },
    {
        path: 'add',
        component: ReviewFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:id',
        component: ReviewFormComponent,
        resolve: {
            review: reviewEditResolve
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
export class ReviewsRoutingModule {}
