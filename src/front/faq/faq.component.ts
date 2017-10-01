import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, RestService } from 'services';

@Component({
    templateUrl: 'faq.component.html'
})
export class FaqComponent implements OnInit {
    loadedFaq;
    faqs;
    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loadedFaq = false;
        this.faqs = [];
        this.rest.getItem('', "faqlist").subscribe(faqs => {
            this.loadedFaq = true;
            this.faqs = faqs;
        });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
