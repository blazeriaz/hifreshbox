import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import * as GlobalVariable from 'global';
import { AlertService, Alert } from 'services';

@Component({
    selector: 'app-front',
    templateUrl: 'message-layout.component.html'
})
export class MessageLayoutComponent implements OnInit, AfterViewInit {
    alerts;
    backgrounds;
    constructor(
        private elRef: ElementRef,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'top-banner-home.png)',
                'background-position' : 'center',
                'background-attachment' : 'fixed',
                'min-height' : '100vh',
                'max-height' : '12000px',
                'height' : 'auto'
            }
        };
    }

    ngAfterViewInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {console.log(alert);
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }
            // add alert to array
            this.alerts.push(alert);
            console.log(this.alerts);
        });
    }
}
