import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { AlertService, Alert, AlertType } from 'services';


@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, AfterViewInit {
    alerts: Alert[] = [];

    constructor(
        private elRef: ElementRef,
        private alertService: AlertService
    ) { }

    ngOnInit() {
    }
    ngAfterViewInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }

            this.elRef.nativeElement.scrollIntoView();

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