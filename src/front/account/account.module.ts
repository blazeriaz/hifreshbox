import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { SharedModule } from 'shared.module';

import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard.component';
import { AddressesComponent } from './addresses.component';
import { ProfileComponent } from './profile.component';
import { AccountRoutingModule } from './account-routing.module';
import { UsersService, PagerService } from 'services';
import { RecipesComponent } from './recipes.component';
import { MealComponent } from './meal.component';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    SelectModule,
    AccountRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    TooltipModule
  ],
  declarations: [
    AccountComponent, DashboardComponent, AddressesComponent, ProfileComponent, RecipesComponent, MealComponent
  ],
  providers: [UsersService, PagerService]
})
export class AccountModule { }
