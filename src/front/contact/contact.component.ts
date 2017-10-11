import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService, RestService } from 'services';
import { AlertComponent } from 'components';
import * as GlobalVariable from 'global';

@Component({
  templateUrl: 'contact.component.html'
})
export class ContactComponent implements OnInit {
  contactForm: any;
  backgrounds;
  submitting;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private rest: RestService
  ) {}

  ngOnInit() {
    this.submitting = false;
    this.contactForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'subject': ['', [Validators.required]],
      'message': ['', [Validators.required]]
    });

    this.backgrounds = {
      header: {
          'background-image': 'url('+GlobalVariable.htmlImages+'top-banner-week-menu.png)',
          'background-position' : 'bottom',
          'background-size': '100% auto',
          'background-color' : '#2F2F30'
      }
    };
  }

  sendMessage() {
    this.alert.clear();
    if (this.contactForm.valid) {
      const sendData = {
        enquiry : this.contactForm.value
      };
      this.submitting = true;
      this.rest.saveItem('', sendData, 'enquiry')
        .subscribe(
            data => {
              this.submitting = false;
              this.contactForm.reset();
              this.alert.success('hi! thank you for connecting with us. we will get back to you shortly as soon as we can');
            },
            error => {
              this.submitting = false;
              this.alert.error('Server Error');
            });
    } else {
      this.alert.error('Please enter the all required fields');
    }
  }

}
