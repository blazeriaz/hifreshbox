import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from "global";
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'account.component.html'
})
export class AccountComponent implements OnInit {

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) { }
  
    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
