import { Component, OnInit, OnDestroy } from '@angular/core';

import * as GlobalVariable from 'global';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  backgrounds;
  constructor() { }
  
    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url('+GlobalVariable.htmlImages+'top-banner-home.png)',
                'background-position' : 'bottom',
                'background-attachment' : 'fixed',
                'background-color' : '#2F2F30'
            },
            cap : GlobalVariable.htmlImages+'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages+'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages+'what-is-freshbox.png',
            gray : {
                'background-image': 'url('+GlobalVariable.htmlImages+'hiw-bg.png)',
                'background-position' : 'top left',
                'background-color' : '#DFDFDF',
                'background-size': 'cover', 
            },
            testimonials : {
                'background-image': 'url('+GlobalVariable.htmlImages+'testimonials.png)',
                'background-size': 'cover', 
                'background-position' : 'top center',
                'background-color' : '#DFDFDF'
            },
            signup: {
                'background-image': 'url('+GlobalVariable.htmlImages+'newsletter-signup.png)',
                'background-size': 'cover', 
                'background-position' : 'top center', 
                'background-color' : '#DFDFDF'
            }
        };
    }
}
