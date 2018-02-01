import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService, RestService } from "services";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
    templateUrl: 'view.component.html'
})
export class OrderViewComponent implements OnInit {
    @ViewChild('viewLoadModal') viewLoadModal: TemplateRef<any>;
    modalViewRef: BsModalRef;
    orderItem;
    loadViewRequest;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService ) {
                       
    }
    
    ngOnInit(): void {
        let orderId = this.route.snapshot.params['id'];
        this.loadViewRequest = this.rest.getItem('', "orders/" + orderId).subscribe(res => {
            this.orderItem = res;
        });

        this.rest.getItem('', "orders/" + orderId + "/comments").subscribe(res => {
            
        });
    }

    shipTheOrder() {
        this.rest.showLoader();
        let sendData = {
            items: [],
            notify: true
        };
        this.rest.saveItem(false, sendData, 'order/' + this.orderItem.entity_id + '/ship').subscribe(res => {
            this.orderItem.status = 'complete';
            this.rest.hideLoader();
            this.loadViewRequest = this.rest.getItem('', "orders/" + this.orderItem.entity_id).subscribe(res => {
                this.orderItem = res;                
            });
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
      if(this.loadViewRequest) {
        this.loadViewRequest.map(sub=>sub?sub.unsubscribe():'');
      }
      this.modalViewRef.hide();
      this.goToList();
    }

    goToList() {
        this.router.navigate(['recipes']);
    }
}
