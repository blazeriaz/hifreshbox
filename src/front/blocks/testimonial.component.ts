import { Component, OnInit, OnDestroy } from '@angular/core';

import * as GlobalVariable from 'global';
import { RestService } from 'services';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'testimonials',
    templateUrl: 'testimonial.component.html'
})
export class TestimonialComponent implements OnInit {
    backgrounds;
    testimonials = [];

    constructor(
        private rest: RestService
    ) { }

    ngOnInit(): void {
        this.backgrounds = {
            testimonials : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'testimonials.png)',
                'background-size': 'cover',
                'background-position' : 'top center',
                'background-color' : '#DFDFDF'
            }
        };

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

        this.rest.getItems(1, [], 5, 'testimonials/search', 'criteria').subscribe(res => {
            this.testimonials = res.items;
        });
    }
}
