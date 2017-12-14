import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersListComponent } from './list.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { PagerService } from 'services';
import { OrderViewComponent } from './view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { SharedModule } from 'shared.module';

@NgModule({
    imports: [
        SelectModule, SharedModule, OrdersRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ OrdersListComponent, OrderViewComponent ],
    providers: [ PagerService]
})
export class OrdersModule { }
