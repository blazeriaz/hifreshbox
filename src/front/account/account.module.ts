import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { SharedModule } from "shared.module";

import { AccountComponent } from './account.component';
import { AddressesComponent } from './addresses.component';
import { ProfileComponent } from './profile.component';
import { AccountRoutingModule } from './account-routing.module';
import { UsersService, PagerService } from "services";

@NgModule({
  imports: [ SharedModule, SelectModule, AccountRoutingModule, CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [
    AccountComponent, AddressesComponent, ProfileComponent
  ],
  providers: [UsersService, PagerService]
})
export class AccountModule { }
