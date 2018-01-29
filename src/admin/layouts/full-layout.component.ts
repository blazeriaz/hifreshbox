import { Component, OnInit }            from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, 
    NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event: RouterEvent) => {
        this.navigationInterceptor(event)
        })
    }

    public footerShow:boolean = false;
    public disabled:boolean = false;
    public status:{isopen:boolean} = {isopen: false};

    public toggled(open:boolean):void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {}

    // Shows and hides the loading spinner during RouterEvent changes
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
