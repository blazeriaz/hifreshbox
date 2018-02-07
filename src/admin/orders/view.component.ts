import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService, RestService } from "services";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import * as GlobalVariable from 'global';

@Component({
    templateUrl: 'view.component.html'
})
export class OrderViewComponent implements OnInit {
    @ViewChild('viewLoadModal') viewLoadModal: TemplateRef<any>;
    modalViewRef: BsModalRef;
    orderItem;
    orderOptions = [];
    needToDestroyEvents = [];

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private location: Location
     ) {
                       
    }
    
    ngOnInit(): void {
        let orderId = this.route.snapshot.params['id'];
        this.needToDestroyEvents.push(this.rest.getItem('', "orders/" + orderId).subscribe(res => {
            this.orderItem = res;
            this.orderItem.pdf_url = GlobalVariable.ORDER_PDF_URL + orderId;
            let orignal_total = 0;
            orignal_total += this.orderItem.subtotal
            orignal_total += this.orderItem.shipping_amount
            orignal_total += this.orderItem.tax_amount
            orignal_total -= this.orderItem.discount_amount
            this.orderItem.wallet_balance = orignal_total - this.orderItem.grand_total;            
        }))
        this.needToDestroyEvents.push(this.rest.getItem('', "order/customoption/" + orderId).subscribe(res => {
            this.orderOptions = res;
        }))
    }

    shipTheOrder() {
        this.rest.showLoader();
        let sendData = {
            items: [],
            notify: true,
            appendComment: true,
            comment: {
                comment: "Order has been shipped!",
                is_visible_on_front: 1
            }
        };
        this.rest.saveItem(false, sendData, 'order/' + this.orderItem.entity_id + '/ship').subscribe(res => {
            this.orderItem.status = 'complete';
            this.rest.hideLoader();
            this.needToDestroyEvents.push(this.rest.getItem('', "orders/" + this.orderItem.entity_id).subscribe(res => {
                this.orderItem = res;                
            }))
        }, e => this.rest.hideLoader());
    }
    
    openEditModal() {
      let config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalViewRef = this.modalService.show(this.viewLoadModal, config);
    }
    
    abortView() {
      this.modalViewRef.hide();
      this.goToList();
    }

    goToList() {
        this.router.navigate(['recipes']);
    }

    ngonDestroy(): void {
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
