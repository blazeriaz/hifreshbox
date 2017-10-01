import { Component, OnInit } from '@angular/core';
import * as GlobalVariable from 'global';

@Component({
    selector: 'app-front',
    templateUrl: 'simple-layout.component.html'
})
export class SimpleLayoutComponent implements OnInit {
    backgrounds;
    constructor() { }

    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'top-banner-home.png)',
                'background-position' : 'center',
                'background-attachment' : 'fixed'
            }
        };
    }
}
