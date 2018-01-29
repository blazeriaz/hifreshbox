import { Component, OnInit, Injectable, Renderer2, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService, AuthService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 12;
import * as GlobalVariable from 'global';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
    templateUrl: 'list.component.html'
})
export class TestimonialsListComponent implements OnInit, OnDestroy {
    @ViewChild('addcbmodal') addcbmodal: TemplateRef<any>;
    
    testimonials:any;
    pager: any;
    loadingList;
    initLoad;
    globalVariable;

    constructor(private rest: RestService,
        private auth: AuthService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder,
                private renderer: Renderer2,
                private modalService: BsModalService ) {
    }

    ngOnInit(): void {
        this.globalVariable = GlobalVariable;
        this.initLoad = true;
        this.loadTestimonialsList(1);
        this.renderer.addClass(document.body, 'white-header');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }

    loadTestimonialsList(pageNo?) {
        const filters = [];
        filters.push({
            filters : [{
                field : 'is_active',
                value : 1,
                condition_type : 'eq'
            }]
        });
        const sortOrders = [{
            field: 'created_time',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.rest.getItems(pageNo, filters, pageSize, 'testimonials/search', 'criteria').subscribe(testimonials => {
            this.initLoad = false;
            this.loadingList = false;
            this.initTestimonialsList(testimonials, pageNo);
        });        
    }

    isLogin() {
        return this.auth.isLogin();
    }
    
    initTestimonialsList(testimonials, page?) {
        this.testimonials = testimonials.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(testimonials.total_count, page, pageSize);        
    }

    setPage(page) {
        this.loadTestimonialsList(page);
    }

    setInputErrorClass(form, input) {
        const field = form.get(input);
        const invalid = field.invalid && field.touched;
        if (invalid) {
            return 'form-control-danger';
        }
    }

    setContainerErrorClass(form, input) {
        const field = form.get(input);
        const invalid = field.invalid && field.touched;
        if (invalid) {
            return 'has-danger';
        }
    }
}
