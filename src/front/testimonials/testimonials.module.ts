import { NgModule }                 from '@angular/core';

import { TestimonialsListComponent } from './list.component';
import { TestimonialsRoutingModule }   from './testimonials-routing.module';
import { ProductsService } from "services";
import { CommonModule } from "@angular/common";
import {SelectModule} from 'ng2-select';
import { PagerService } from 'services/index'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {SharedModule} from "shared.module";
import { TabsModule, TooltipModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        SelectModule, TestimonialsRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, 
        SharedModule, TabsModule, TooltipModule
    ],
    declarations: [ TestimonialsListComponent ],
    providers: [ProductsService, PagerService]
})
export class TestimonialsModule { }
