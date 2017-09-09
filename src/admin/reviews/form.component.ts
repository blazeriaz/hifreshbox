import { Component, OnInit, Injectable, TemplateRef, ViewChild } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as GlobalVariable from "../../global";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Injectable()
export class reviewEditResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    let reviewId = route.params['id'];
    return this.rest.getItem('', 'reviews/' + reviewId);
  }
}

@Component({
    templateUrl: 'form.component.html'
})
export class ReviewFormComponent implements OnInit {
  @ViewChild('savemodal') saveModal: TemplateRef<any>;
    review:any;
    reviewForm:any;
    submitted;
    updatingMessage;
    saveModalClose;
    abortModalClose;
    saveRequests;
    public modalRef: BsModalRef;

    constructor(
      private reviewsService: ProductsService,
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder,
      private modalService: BsModalService
    ) {
      this.rest.setRestModule('products');
    }
    
    ngOnInit(): void {
      let reviewId = this.route.snapshot.params['id'];
      this.review = (reviewId)?this.route.snapshot.data['review']:{};

      this.reviewForm = this._fb.group({
        name : [this.review.name, [Validators.required, Validators.minLength(5)]],
        visibility: 1,
        type_id : 'simple',
        price : 0,
        status : 1,
        attribute_set_id : 16,
        extension_attributes : this._fb.group({
          stock_item : this._fb.group({
            manage_stock : 0,
            is_in_stock : 1,
            qty : 0
          })
        })
      });
    }

    setInputErrorClass(input) {
      let invalid = this.reviewForm.get(input).invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
      let invalid = this.reviewForm.get(input).invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    noticeReviewSaved = function() {
      this.updatingMessage = "The Review has been saved successfully!"; 
      this.saveModalClose = true;
      this.abortModalClose = false;
    }

    saveReview() {
      this.alert.clear();
      this.submitted = true;
      if (this.reviewForm.valid) {
          let reviewId = this.route.snapshot.params['id'];
          
          let sendData = this.reviewForm.value;
          let saveUrl = "review"; 
          if(reviewId) {
            saveUrl += "/" + reviewId;
          }

          this.updatingMessage = "Uploading the Review information...";
          this.saveModalClose = false;
          this.abortModalClose = true;
          this.openSaveModal();
          this.saveRequests = [];
          this.saveRequests.push(this.rest.saveItem(reviewId, {product : sendData}, saveUrl).subscribe(product => {    
            this.noticeReviewSaved();
          }));
      } else {
        this.alert.error("Please check the form to enter all required details");        
      }
    }
    
    openSaveModal() {
      let config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalRef = this.modalService.show(this.saveModal, config);
    }

    abortSave() {
      if(this.saveRequests && this.saveRequests.length > 0) {
        this.saveRequests.map(sub=>sub?sub.unsubscribe():'');
      }
      this.modalRef.hide();
    }

    goToList() {
      this.router.navigate(['reviews']);
    }
}
