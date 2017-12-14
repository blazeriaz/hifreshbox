import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent, LogoutComponent } from './login.component';
import { ForgetComponent } from './forget.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetComponent, checkRestTokenResolve } from './reset.component';
import { RegisterComponent } from './register.component';
import { TabsModule, AccordionModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { ConfirmRegisterComponent } from './confirm.register.component';
import { ActivateComponent, checkActivateTokenResolve } from './activate.component';

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
    ActivateComponent, LoginComponent, LogoutComponent, ForgetComponent, ResetComponent, RegisterComponent, ConfirmRegisterComponent
  ],
  providers: [
    checkRestTokenResolve, checkActivateTokenResolve
  ]
})
export class AuthModule { }
