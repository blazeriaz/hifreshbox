import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { TestimonialsListComponent } from './list.component';

const routes: Routes = [
    {
        path: '',
        component: TestimonialsListComponent,
        data: {
            title: 'Testimonials'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestimonialsRoutingModule {}
