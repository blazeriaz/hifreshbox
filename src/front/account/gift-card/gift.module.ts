import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared.module';

import { GiftCardsListComponent } from './list.component';
import { GiftCardsRoutingModule } from './gift-routing.module';
import { PagerService } from 'services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { DebitGiftCardsListComponent } from './debit-list.component';

@NgModule({
    imports: [
        SharedModule, SelectModule, GiftCardsRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, CreditCardDirectivesModule
    ],
    declarations: [ GiftCardsListComponent, DebitGiftCardsListComponent ],
    providers: [ PagerService]
})
export class GiftCardsModule { }
