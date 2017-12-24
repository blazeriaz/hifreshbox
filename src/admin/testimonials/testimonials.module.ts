import { NgModule } from '@angular/core';

import { TestimonialsListComponent } from './list.component';
import { TestimonialRoutingModule } from './testimonials-routing.module';
import { CommonModule } from '@angular/common';
import { TestimonialFormComponent } from './form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng2-select';
import { PagerService } from 'services/index'

import {SharedModule} from 'shared.module';
import {DndModule} from 'ng2-dnd';

@NgModule({
    imports: [
        SelectModule, TestimonialRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule, DndModule
    ],
    declarations: [ TestimonialsListComponent, TestimonialFormComponent ],
    providers: [PagerService]
})
export class TestimonialsModule { }
