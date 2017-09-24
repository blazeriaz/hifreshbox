import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService, RestService } from "services";
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
    templateUrl: 'form.component.html'
})
export class TestimonalFormComponent implements OnInit {
    @ViewChild('savemodal') saveModal: TemplateRef<any>;
    @ViewChild('editLoadModal') editLoadModal: TemplateRef<any>;
    
    user:any;
    userForm: any;
    testimonial:any;
    testimonialForm:any;
    submitted:boolean;

    updatingMessage;
    saveModalClose;
    abortModalClose;
    saveRequests;
    public modalRef: BsModalRef;

      
    modalEditRef: BsModalRef;   
    serverMediaImages;
    loadedFormData;
    countLoadedFormReqs;
    loadFormRequests;

    constructor( 
                private alert: AlertService,
                private rest: RestService,
                private _fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private modalService: BsModalService ) {        
               
    }
    
    ngOnInit(): void {
        this.loadFormRequests = [];
        this.countLoadedFormReqs = 0;
        this.loadedFormData = false;
       // this.openEditModal();	
        this.loadFormData();

        let userId = this.route.snapshot.params['id'];
        this.user = {};
        this.loadedFormData = true;
        
		///this.modalEditRef.hide();
    }
    
    openEditModal() {
      let config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      };
      //this.modalEditRef = this.modalService.show(this.editLoadModal, config);
    }
    
    abortEdit() {
      if(this.loadFormRequests && this.loadFormRequests.length > 0) {
        this.loadFormRequests.map(sub=>sub?sub.unsubscribe():'');
      }
      //this.modalEditRef.hide();
      this.goToList();
    }

    checkAllFormDataLoaded() {      
      if(--this.countLoadedFormReqs == 0) {
        //this.modalEditRef.hide();
        this.initEditForm(); 
        this.loadedFormData = true; 
      }
    }

    
    
    loadFormData() {
        let userId = this.route.snapshot.params['name'];
        this.user = {};
        if(!userId) return;
        this.user.id = userId;
        this.loadFormRequests.push(
            this.rest.getItem(userId, 'testimonal/' + userId).subscribe(user => {
                this.user = user;
                this.checkAllFormDataLoaded();
            })
        );
        this.countLoadedFormReqs++;
    }

    initEditForm() {
        this.testimonialForm = this._fb.group({
            'id': this.testimonial.id,
            'name': [this.testimonial.name, Validators.required],
            'email': [this.testimonial.email, [Validators.required, Validators.email]],
            'content': this.testimonial.content,
            'type':1
        });
    }
   

    setType(type) {
        this.testimonialForm.patchValue({type : type});
    }

    getType() {
        return this.testimonialForm.value.type;
    }

    patchAddressValue(i: number, values: object) {
        if(this.userForm.controls['addresses'].controls[i])
            this.userForm.controls['addresses'].controls[i].patchValue(values);
    }

    setStatusClass(type) {  
        if(this.getType() == type) {
            return 'bg-primary';
        } else {
            return 'bg-secondary';
        }
    }

    setInputErrorClass(input) {
        let invalid = this.userForm.get(input).invalid && this.submitted;
        if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
        let invalid = this.userForm.get(input).invalid && this.submitted;
        if(invalid) return 'has-danger';
    }

   

    noticeUserSaved = function() {
        this.updatingMessage = "The customer details have been saved successfully!"; 
        this.saveModalClose = true;
        this.abortModalClose = false;
    }

    saveUser() {
        this.alert.clear();
        this.submitted = true;
        if (this.userForm.valid) {                   
            let userId = this.route.snapshot.params['id'];
            userId = (userId)?userId:'';

            this.updatingMessage = "Uploading the Customer information...";
            this.saveModalClose = false;
            this.abortModalClose = true;
            this.openSaveModal();
            this.saveRequests = [];

            this.rest.saveItem(userId, {customer: this.userForm.value}, "customers/" + userId).subscribe(data => {
                this.noticeUserSaved();                  
            });
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
      this.router.navigate(['testimonal']);
    }
}
