import { Component } from '@angular/core';

@Component({
  selector: 'nga-sidebar-test',
  styleUrls: ['./nga-sidebar-test.component.scss'],
  template: `
    <nga-layout>
      <nga-sidebar></nga-sidebar>
      
      <nga-layout-content>
      </nga-layout-content>
    </nga-layout>
`,
})
export class NgaSidebarTestComponent {
}
