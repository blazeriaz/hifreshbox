import { Component, OnInit, OnDestroy, AfterContentInit, ElementRef, HostListener } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, 
  NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";
 import { Subscription } from 'rxjs/Subscription';
 import { AuthService, AlertService, RestService } from "services";

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: `
    <div class="overlay_loading app flex-row align-items-center" *ngIf="loading">
      <div class="sk-three-bounce">
        <div class="sk-child sk-bounce1"></div>
        <div class="sk-child sk-bounce2"></div>
        <div class="sk-child sk-bounce3"></div>
      </div>
    </div>
    <router-outlet></router-outlet>
  `
})
export class FrontComponent implements OnInit { 

  @HostListener('window:scroll', ['$event']) private onScroll($event:Event):void {
    if(window.pageYOffset > 80) {
      this.elementRef.nativeElement.classList.add('scrolled-down');
    } else {
      this.elementRef.nativeElement.classList.remove('scrolled-down');
    }
  };

  // Sets initial value to true to show loading spinner on first load
  loading = true
  time;
  bodyclass;
  private subscription: Subscription;

  constructor(private router: Router, 
    private rest: RestService,
    private elementRef: ElementRef ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    })
  }

  ngAfterContentInit() {
    this.bodyclass.forEach(className => {
      this.elementRef.nativeElement.classList.add(className);
    });    
  }

  ngOnInit() { 
    this.bodyclass = "app header-fixed sidebar-hidden aside-menu-fixed aside-menu-hidden".split(" ");
    this.subscription = this.rest.loaderState
        .subscribe((state:any) => {
            this.loading = state.show;
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) { 
      console.log("Nav start");
      this.time = Date.now();
      this.loading = true
    }
    if (event instanceof NavigationEnd) {
      console.log("Nav End");
      console.log(( Date.now() - this.time));
      this.loading = false;
      window.scroll(0, 0);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false
    }
    if (event instanceof NavigationError) {
      this.loading = false
    }
  }
}
