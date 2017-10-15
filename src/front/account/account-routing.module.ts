import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { AddressesComponent } from './addresses.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Account'
    },
    children: [
      {
        path: '',
        component: AccountComponent,
        data: {
          title: 'Account'
        }
      },{
        path: 'addresses',
        component: AddressesComponent,
        data: {
          title: 'Addresses'
        }
      },{
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Edit Profile'
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
