import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent, LogoutComponent } from './login.component';
import { ForgetComponent } from './forget.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetComponent, checkRestTokenResolve } from './reset.component';
import { RegisterComponent } from './register.component';


@NgModule({
  imports: [ AuthRoutingModule, ReactiveFormsModule ],
  declarations: [
    LoginComponent, LogoutComponent, ForgetComponent, ResetComponent, RegisterComponent
  ],
  providers: [
    checkRestTokenResolve
  ]
})
export class AuthModule { }
