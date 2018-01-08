import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Alert, AlertType } from './alert.model';

@Injectable()
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false, displayId: string = 'default') {
        this.alert(AlertType.Success, message, keepAfterRouteChange, displayId);
    }

    error(message: string, keepAfterRouteChange = false, displayId: string = 'default') {
        this.alert(AlertType.Error, message, keepAfterRouteChange, displayId);
    }

    info(message: string, keepAfterRouteChange = false, displayId: string = 'default') {
        this.alert(AlertType.Info, message, keepAfterRouteChange, displayId);
    }

    warn(message: string, keepAfterRouteChange = false, displayId: string = 'default') {
        this.alert(AlertType.Warning, message, keepAfterRouteChange, displayId);
    }

    alert(type: AlertType, message: string, keepAfterRouteChange = false, displayId: string = 'default') {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Alert>{ type: type, displayId: displayId, message: message });
    }

    clear() {
        // clear alerts
        this.subject.next();
    }
}
