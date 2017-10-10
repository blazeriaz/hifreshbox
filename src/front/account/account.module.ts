import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';

import { AccountComponent } from './account.component';
import { AddressesComponent } from './addresses.component';
import { AccountRoutingModule } from './account-routing.module';
import { UsersService, PagerService } from "services";

@NgModule({
  imports: [ SelectModule, AccountRoutingModule, CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [
    AccountComponent, AddressesComponent
  ],
  providers: [UsersService, PagerService]
})
export class AccountModule { }
