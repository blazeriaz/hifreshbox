import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { AuthService } from "services/auth.service";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
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
        path: 'orders',
        canActivate: [AuthService],
        loadChildren: './orders/orders.module#OrdersModule'
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
        canActivate: [AuthService],
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        path: 'reviews',
        canActivate: [AuthService],
        loadChildren: './reviews/reviews.module#ReviewsModule'
      },
      {
        path: 'testimonials',
        canActivate: [AuthService],
        loadChildren: './testimonials/testimonials.module#TestimonialsModule'
      },
      {
        path: 'faqs',
        canActivate: [AuthService],
        loadChildren: './faq/faq.module#FaqModule'
      },
      {
        path: 'newsletter',
        canActivate: [AuthService],
        loadChildren: './newsletter/newsletter.module#NewsletterModule'
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