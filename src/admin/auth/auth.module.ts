import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent, LogoutComponent } from './login.component';
import { ForgetComponent } from './forget.component';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  imports: [ AuthRoutingModule, ReactiveFormsModule ],
  declarations: [
    LoginComponent, LogoutComponent, ForgetComponent
  ]
})
export class AuthModule { }
