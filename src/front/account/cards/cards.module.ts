import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsListComponent } from './list.component';
import { CardsRoutingModule } from './cards-routing.module';
import { PagerService } from 'services';
import { OrderViewComponent } from './view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        SelectModule, CardsRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ CardsListComponent, OrderViewComponent ],
    providers: [ PagerService]
})
export class CardsModule { }
