import { Component } from '@angular/core';

import 'style-loader!./app.component.scss';

@Component({
  selector: 'nga-app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
}
