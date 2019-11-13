import { Component, OnInit, HostListener } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, 
    NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import * as GlobalVariable from "global";
import { LayoutService } from 'services/layout.service';

@Component({
    selector: 'app-front',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
    backgrounds;

    constructor(
        private router: Router,
        private layoutService: LayoutService
    ) {        
        router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event)
        })
    }

    ngOnInit(): void {
        this.layoutService.layoutInit();
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

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            document.querySelector('body').classList.remove('sidebar-mobile-show');
        }
        if (event instanceof NavigationEnd) {
            document.querySelector('body').classList.remove('sidebar-mobile-show');
        }

        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
        }
        if (event instanceof NavigationError) {
        }
    }
}
