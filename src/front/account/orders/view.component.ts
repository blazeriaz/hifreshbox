import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService, RestService } from 'services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as GlobalVariable from 'global';

@Component({
    templateUrl: 'view.component.html'
})
export class OrderViewComponent implements OnInit {
    @ViewChild('viewLoadModal') viewLoadModal: TemplateRef<any>;
    modalViewRef: BsModalRef;
    orderItem;
    orderOptions = [];
    loadViewRequest;
    pdf_url;


    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService ) {
    }

    ngOnInit(): void {
        const orderId = this.route.snapshot.params['id'];        
        this.pdf_url = GlobalVariable.ORDER_PDF_URL + orderId;
        this.rest.getItem('', 'customer-orders/' + orderId).subscribe(res => {
            this.orderItem = res;
            let orignal_total = 0;
            orignal_total += this.orderItem.subtotal
            orignal_total += this.orderItem.shipping_amount
            orignal_total += this.orderItem.tax_amount
            orignal_total -= this.orderItem.discount_amount
            this.orderItem.wallet_balance = orignal_total - this.orderItem.grand_total;            
        });
        this.rest.getItem('', "order/customoption/" + orderId).subscribe(res => {
            this.orderOptions = res;
        })
    }
}
