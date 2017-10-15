import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestimonialsListComponent } from './list.component';
import { TestimonialFormComponent } from './form.component';

const routes: Routes = [
    {
        path: '',
        component: TestimonialsListComponent,
        data: {
            title: 'Testimonials'
        }
    },
    {
        path: 'add',
        component: TestimonialFormComponent,
        data: {
            title: 'Add'
        }
    },
    {
        path: 'edit/:id',
        component: TestimonialFormComponent,
        data: {
            title: 'Edit'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestimonialRoutingModule {}
