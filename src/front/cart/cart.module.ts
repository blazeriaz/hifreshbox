import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { SharedModule } from 'shared.module';
import { CreditCardDirectivesModule } from 'angular-cc-library';

import { CartRoutingModule } from './cart-routing.module';
import { UsersService, PagerService } from 'services';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';

import { CartComponent } from './cart.component';
import { CheckoutComponent } from './checkout.component';
import { ShippingAddressComponent } from './shipping.address.component';
import { BillingAddressComponent } from './billing.address.component';
import { ConfirmComponent } from './confirm.component';
import { MealComponent } from './meal.component';
import { PaymentComponent } from './payment.component';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    SharedModule,
    SelectModule,
    CreditCardDirectivesModule,
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
    BillingAddressComponent,
    ShippingAddressComponent,
    ConfirmComponent,
    MealComponent,
    PaymentComponent,
    LoginComponent
  ],
  providers: [UsersService, PagerService]
})
export class CartModule { }
