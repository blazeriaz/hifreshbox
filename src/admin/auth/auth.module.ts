import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { ForgetComponent } from './forget.component';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  imports: [ AuthRoutingModule, ReactiveFormsModule ],
  declarations: [
    LoginComponent, ForgetComponent
  ]
})
export class AuthModule { }
