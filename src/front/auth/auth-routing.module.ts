import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, LogoutComponent } from './login.component';
import { ForgetComponent } from './forget.component';
import { ResetComponent, checkRestTokenResolve } from "./reset.component";
import { RegisterComponent } from './register.component';
import { ConfirmRegisterComponent } from './confirm.register.component';
import { ActivateComponent, checkActivateTokenResolve } from './activate.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Auth'
    },
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login'
        }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'Login'
        }
      },
      {
        path: 'logout',
        component: LogoutComponent,
        data: {
          title: 'Logout'
        }
      },
      {
        path: 'forget',
        component: ForgetComponent,
        data: {
          title: 'Forget Password'
        }
      },
      {
        path: 'reset/:customerId/:token',
        component: ResetComponent,
        resolve: {
          check: checkRestTokenResolve
        },
        data: {
          title: 'Reset Password'
        }
      }, {
        path: 'confirm-register',
        component: ConfirmRegisterComponent,
        data: {
          title: 'Confirm Register'
        }
      }, {
        path: 'activate/:id/:token',
        component: ActivateComponent,        
        resolve: {
          check: checkActivateTokenResolve
        },
        data: {
          title: 'Activate Register'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
