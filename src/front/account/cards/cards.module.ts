import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared.module';

import { CardsListComponent } from './list.component';
import { CardsRoutingModule } from './cards-routing.module';
import { PagerService } from 'services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { CreditCardDirectivesModule } from 'angular-cc-library';

@NgModule({
    imports: [
        SharedModule, SelectModule, CardsRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, CreditCardDirectivesModule
    ],
    declarations: [ CardsListComponent ],
    providers: [ PagerService]
})
export class CardsModule { }
