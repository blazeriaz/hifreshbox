import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { AuthService } from "services/auth.service";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,    
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthService],
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'users',
        canActivate: [AuthService],
        loadChildren: './users/users.module#UsersModule'
      },
      {
        path: 'recipes',
        canActivate: [AuthService],
        loadChildren: './recipes/recipes.module#RecipesModule'
      },
      {
        path: 'swags',
        canActivate: [AuthService],
        loadChildren: './swags/swags.module#SwagsModule'
      },
      {
        path: 'menu',
        canActivate: [AuthService],
        loadChildren: './menu/menu.module#MenuModule'
      },
      {
        path: 'masters',
        canActivate: [AuthService],
        loadChildren: './masters/masters.module#MastersModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      }
    ]
  },
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    data: {
      title: 'Auth'
    },
    children: [
      {
        path: '',
        loadChildren: './auth/auth.module#AuthModule',
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AdminRoutingModule {}
