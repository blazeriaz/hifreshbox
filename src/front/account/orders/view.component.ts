import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService, RestService } from 'services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'view.component.html'
})
export class OrderViewComponent implements OnInit {
    @ViewChild('viewLoadModal') viewLoadModal: TemplateRef<any>;
    modalViewRef: BsModalRef;
    orderItem;
    orderOptions = [];
    loadViewRequest;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService ) {
    }

    ngOnInit(): void {
        const orderId = this.route.snapshot.params['id'];
        this.rest.getItem('', 'customer-orders/' + orderId).subscribe(res => {
            this.orderItem = res;
        });
        this.rest.getItem('', "order/customoption/" + orderId).subscribe(res => {
            this.orderOptions = res;
        })
    }
}
