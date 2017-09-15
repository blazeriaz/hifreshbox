import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FrontComponent } from "front/front.component";
import { HomeComponent } from "front/home/home.component";
import { MenuComponent } from "front/menu/menu.component";
import { FullLayoutComponent } from "front/layouts/full-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: FrontComponent,    
    data: {
      title: 'Home'
    },
    children : [{
      path: '',
      component: FullLayoutComponent,    
      data: {
        title: 'Home'
      },
      children : [{
        path: '',
        component: HomeComponent,    
        data: {
          title: 'Home'
        }
      },{
        path: 'menu',
        component: MenuComponent,    
        data: {
          title: 'Menu'
        }
      }]      
    }]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class FrontRoutingModule {}