import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import {  AlertService, RestService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
 
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as GlobalVariable from "../../global";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
    templateUrl: 'form.component.html'
})
export class FaqFormComponent implements OnInit {
  @ViewChild('savemodal') saveModal: TemplateRef<any>;
  @ViewChild('editLoadModal') editLoadModal: TemplateRef<any>;
  
    faq:any;
    faqForm:any;
    submitted:any;
    updatingMessage;
    saveModalClose;
    abortModalClose;
    saveRequests;
    public modalRef: BsModalRef;   
    modalEditRef: BsModalRef;  
    loadedFormData;
    countLoadedFormReqs;
    loadFormRequests;
    constructor(
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder,
      private modalService: BsModalService
    ) { }
    
    ngOnInit(): void { 
      this.faq = {};
      this.saveModalClose = false;
      this.abortModalClose = false
      this.loadFormRequests = [];
      this.countLoadedFormReqs = 0;
      this.loadedFormData = false;
      
      this.loadFormData();
      if(this.loadFormRequests.length == 0) { 
        this.checkAllFormDataLoaded();
      } else {
        this.openEditModal();
      }
    } 
    
    openEditModal() {
      let config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalEditRef = this.modalService.show(this.editLoadModal, config);
    }
    
    abortEdit() {
      if(this.loadFormRequests && this.loadFormRequests.length > 0) {
        this.loadFormRequests.map(sub=>sub?sub.unsubscribe():'');
      }
      this.modalEditRef.hide();
      this.goToList();
    }

    checkAllFormDataLoaded() {      
      if(--this.countLoadedFormReqs <= 0) { 
        this.modalRef && this.modalRef.hide();
        //this.initEditForm();  
        this.loadedFormData = true; 
      }
    }

    loadFormData() {
      let faqId = this.route.snapshot.params['id'];    
      this.faq = {};  
      if(!faqId) return;
      this.faq.sku = faqId;
      this.loadFormRequests.push(
        this.rest.getItem(faqId, 'products/' + faqId).subscribe(faq => {
          this.faq = faq;
          this.checkAllFormDataLoaded();
        })
      );
      this.countLoadedFormReqs++;
    }   
    
    initEditForm() {
      this.faqForm = this._fb.group({
        question : [this.faq.question, [Validators.required]],
        status : this.faq.status?this.faq.status:1
      });
    }



    setStatus(status) {
        this.faqForm.patchValue({status : status});
    }

    getStatus() {
        return this.faqForm.value.status;
    }

    setStatusClass(type) { 
        if(this.getStatus() == type) {
            return 'btn-primary';
        } else {
            return 'btn-secondary';
        }
    }

    setInputErrorClass(input) {
      let invalid = this.faqForm.get(input).invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
      let invalid = this.faqForm.get(input).invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    saveFaq() {
      this.alert.clear();
      this.submitted = true;
      if (this.faqForm.valid) {
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
      this.router.navigate(['faq']);
    }
}
