import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AlertService, RestService } from 'services';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as GlobalVariable from '../../global';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'form.component.html'
})
export class TestimonialFormComponent implements OnInit {
  @ViewChild('savemodal') saveModal: TemplateRef<any>;
  @ViewChild('editLoadModal') editLoadModal: TemplateRef<any>;

  testimonial: any;
  testimonialForm: any;
  submitted: any;
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
    private _fb: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.testimonial = {};
    this.saveModalClose = false;
    this.abortModalClose = false;

    this.loadFormRequests = [];
    this.countLoadedFormReqs = 0;
    this.loadedFormData = false;

    this.loadFormData();
    if (this.loadFormRequests.length === 0) {
      this.checkAllFormDataLoaded();
    } else {
      this.openEditModal();
    }
  }

  openEditModal() {
    this.modalEditRef = this.modalService.show(this.editLoadModal, {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  abortEdit() {
    if (this.loadFormRequests && this.loadFormRequests.length > 0) {
      this.loadFormRequests.map(sub => sub ? sub.unsubscribe() : '');
    }
    this.modalEditRef.hide();
    this.goToList();
  }

  checkAllFormDataLoaded() {
    if (--this.countLoadedFormReqs <= 0) {
      // tslint:disable-next-line:no-unused-expression
      this.modalEditRef && this.modalEditRef.hide();
      this.initEditForm();
      this.loadedFormData = true;
    }
  }

  loadFormData() {
    const testimonialId = this.route.snapshot.params['id'];
    this.testimonial = {};
    // tslint:disable-next-line:curly
    if (!testimonialId) return;
    this.testimonial.id = testimonialId;
    this.loadFormRequests.push(
      this.rest.getItem(testimonialId, 'testimonials/' + testimonialId).subscribe(testimonial => {
        this.testimonial = testimonial;
        this.checkAllFormDataLoaded();
      })
    );
    this.countLoadedFormReqs++;
  }

  initEditForm() {
    this.testimonialForm = this._fb.group({
      name : [this.testimonial.name, [Validators.required]],
      email : [this.testimonial.email, [Validators.required, Validators.email]],
      content : [this.testimonial.content, [Validators.required]],
      is_active : this.testimonial.is_active ? this.testimonial.is_active : 1,
    });
  }

  setStatus(is_active) {
      this.testimonialForm.patchValue({is_active : is_active});
  }

  getStatus() {
      return this.testimonialForm.value.is_active;
  }

  setStatusClass(type) {
      if(this.getStatus() === type) {
          return 'btn-primary';
      } else {
          return 'btn-secondary';
      }
  }

  setInputErrorClass(input) {
    const invalid = this.testimonialForm.get(input).invalid && this.submitted;
    // tslint:disable-next-line:curly
    if (invalid) return 'form-control-danger';
  }

  setContainerErrorClass(input) {
    const invalid = this.testimonialForm.get(input).invalid && this.submitted;
    // tslint:disable-next-line:curly
    if (invalid) return 'has-danger';
  }

  saveTestimonial() {
    this.alert.clear();
    this.submitted = true;
    if (this.testimonialForm.valid) {
      let testimonialId = this.route.snapshot.params['id'];
      const sendData = this.testimonialForm.value;
      let saveUrl = 'testimonials';
      if (!testimonialId) {
        testimonialId = '';
      } else {
        saveUrl += '/' + testimonialId;
      }
      this.updatingMessage = 'Uploading the Testimonial information...';
      this.saveModalClose = false;
      this.abortModalClose = true;
      this.openSaveModal();
      this.saveRequests = [];
      this.saveRequests.push(this.rest.saveItem(testimonialId, {testimonial : sendData}, saveUrl).subscribe(data => {
        this.updatingMessage = 'The Testimonial information saved successfully!'; 
        this.saveModalClose = true;
        this.abortModalClose = false;
        this.modalRef.hide();
        this.goToList();
      }));
    } else {
      this.alert.error('Please check the form to enter all required details');
    }
  }

  openSaveModal() {
    this.modalRef = this.modalService.show(this.saveModal, {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  abortSave() {
    if (this.saveRequests && this.saveRequests.length > 0) {
      this.saveRequests.map(sub => sub ? sub.unsubscribe() : '');
    }
    this.modalRef.hide();
  }

  goToList() {
    this.router.navigate(['testimonials']);
  }
}
