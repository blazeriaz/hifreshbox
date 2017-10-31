import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent, LogoutComponent } from './login.component';
import { ForgetComponent } from './forget.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetComponent, checkRestTokenResolve } from './reset.component';
import { RegisterComponent } from './register.component';
import { TabsModule, AccordionModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    LoginComponent, LogoutComponent, ForgetComponent, ResetComponent, RegisterComponent
  ],
  providers: [
    checkRestTokenResolve
  ]
})
export class AuthModule { }
