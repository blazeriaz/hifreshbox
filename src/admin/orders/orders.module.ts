import { NgModule }                 from '@angular/core';
import { CommonModule } from "@angular/common";

import { OrdersListComponent } from './list.component';
import { OrdersRoutingModule }   from './orders-routing.module';
import { PagerService } from "services";
import { OrderFormComponent } from "./form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        SelectModule, OrdersRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ OrdersListComponent, OrderFormComponent ],
    providers: [ PagerService]
})
export class OrdersModule { }
