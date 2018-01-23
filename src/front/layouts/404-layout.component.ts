import { Component, OnInit, HostListener } from '@angular/core';
import * as GlobalVariable from "global";

@Component({
    templateUrl: './404-layout.component.html'
})
export class NotFoundComponent implements OnInit {
    backgrounds;

    constructor() { }

    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url(' + GlobalVariable.htmlImages + '404-bg-image.png)',
                'background-position' : 'bottom',
                'background-size': 'cover', 
                'background-attachment' : 'fixed',
                'background-color' : '#2F2F30'
            },
            recipe : GlobalVariable.htmlImages+'each-recipe-img.png',
            cap : GlobalVariable.htmlImages+'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages+'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages+'what-is-freshbox.png',
            gray : {
                'background-image': 'url('+GlobalVariable.htmlImages+'hiw-bg.png)',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF',
                'background-size': 'cover', 
            },
            footer_logo: GlobalVariable.htmlImages + 'footer-logo.png'
        };
    }
}
