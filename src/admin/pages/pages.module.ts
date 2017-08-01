import { NgModule } from '@angular/core';

import { LoginComponent } from './login.component';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [ PagesRoutingModule ],
  declarations: [
    LoginComponent
  ]
})
export class PagesModule { }
