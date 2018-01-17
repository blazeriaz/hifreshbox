import { Component, OnInit, ElementRef, AfterViewInit, Input } from '@angular/core';
import { AlertService, Alert, AlertType } from 'services';


@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, AfterViewInit {
    @Input() displayId: string;
    alerts: Alert[] = [];

    constructor(
        private elRef: ElementRef,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        if(!this.displayId) {
            this.displayId = 'default';
        }
    }
    ngAfterViewInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }
            if(alert.displayId !== this.displayId) {
                return;
            }

            window.scroll(0, 0);

            // add alert to array
            this.alerts.push(alert);
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        // return css class based on alert type
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}