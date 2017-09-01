import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, LogoutComponent } from './login.component';
import { ForgetComponent } from './forget.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
