import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard.component';
import { AddressesComponent } from './addresses.component';
import { ProfileComponent } from './profile.component';
import { RecipesComponent } from './recipes.component';
import { MealComponent } from './meal.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Account'
    },
    component: AccountComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: 'Account'
        }
      }, {
        path: 'addresses',
        component: AddressesComponent,
        data: {
          title: 'Addresses'
        }
      }, {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Edit Profile'
        }
      }, {
        path: 'my-recipes',
        component: RecipesComponent,
        data: {
          title: 'My Recipes'
        }
      }, {
        path: 'meal-preference',
        component: MealComponent,
        data: {
          title: 'Change Meal preference'
        }
      }, {
        path: 'orders',
        loadChildren: './orders/orders.module#OrdersModule',
        data: {
          title: 'Orders'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
