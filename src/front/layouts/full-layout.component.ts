import { Component, OnInit, HostListener } from '@angular/core';
import * as GlobalVariable from "global";

@Component({
    selector: 'app-front',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
    backgrounds;

    constructor() { }

    ngOnInit(): void {
        this.backgrounds = {
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
