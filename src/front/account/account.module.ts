import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  imports: [ AccountRoutingModule, ReactiveFormsModule ],
  declarations: [
    AccountComponent
  ],
  providers: [
  ]
})
export class AccountModule { }
