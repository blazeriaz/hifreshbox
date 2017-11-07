import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { SharedModule } from 'shared.module';


import { CartRoutingModule } from './cart-routing.module';
import { UsersService, PagerService } from 'services';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';

import { CartComponent } from './cart.component';
import { CheckoutComponent } from './checkout.component';
import { AddressComponent } from './address.component';
import { ConfirmComponent } from './confirm.component';
import { MealComponent } from './meal.component';
import { PaymentComponent } from './payment.component';

@NgModule({
  imports: [
    SharedModule,
    SelectModule,
    CartRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    TooltipModule
  ],
  declarations: [
    CartComponent,
    CheckoutComponent,
    AddressComponent,
    ConfirmComponent,
    MealComponent,
    PaymentComponent
  ],
  providers: [UsersService, PagerService]
})
export class CartModule { }
