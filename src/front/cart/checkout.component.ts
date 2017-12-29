import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService, CartService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { concat } from 'rxjs/operator/concat';

@Component({
  templateUrl: 'checkout.component.html'
})
export class CheckoutComponent implements OnInit, OnDestroy {
    cart;
    totals;
    allSteps;
    steps = [];
    currentStep;
    needDestroyServices;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private auth: AuthService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.allSteps = [{
            key: 'login',
            title: 'Login',
        }, {
            key: 'meal',
            title: 'Meal preference'
        }, {
            key: 'address',
            title: 'Address'
        }, {
            key: 'payment',
            title: 'Payment Info'
        }, {
            key: 'confirm',
            title: 'Order Summery'
        }];

        this.needDestroyServices = [];
        this.needDestroyServices.push(
            this.cartService.getCartTotal().subscribe(data => {
                this.cart = data.cart;
                this.totals = data.totals;

                if(!this.cart || this.cart.loading || this.cart.mealPreferenceLoading) {
                    return;
                }

                if (!this.validateHaveCartItems(data)) {
                    this.alert.error('No items added for checkout.', true);
                    this.router.navigate(['/', 'cart']);
                }

                if (!data.mealAdded) {
                    this.steps = this.allSteps.filter(x => x.key !== 'meal');
                } else if (data.mealPreferences && data.mealPreferences.length > 0) {
                    this.steps = this.allSteps.filter(x => {
                        if (x.key === 'meal' && x.complete !== 1 && this.currentStep !== 'login') {
                            this.goToStep('meal', true);
                        }
                        return true;
                    });
                }

                if (!data.cart || this.currentStep) {
                    return;
                }
                this.currentStep = 'login';

                if (this.auth.isLogin()) {
                    this.goToStep('address', true);
                }
            })
        );
    }

    validateHaveCartItems(data) {
        if (data.mealAdded) {
            return true;
        }
        if (!data.loading && data.cart && data.cart.items_qty !== 0) {
            return true;
        }
        if (!data.loading && data.totals && data.totals.items_qty !== 0) {
            return true;
        }
        return data.loading;
    }

    checkStepDisabled(step) {
        if (this.currentStep === step.key) {
            return false;
        }
        if(step.key == 'login' && this.auth.isLogin()) {
            return true;
        }
        return !step.complete;
    }

    goToStep(step, force = false) {
        if(step == 'login' && this.auth.isLogin()) {
            return;
        }
        const index = this.steps.findIndex(x => x.key === step);
        const index1 = this.steps.findIndex(x => x.key === this.currentStep);        
        if (!force && index1 <= index) {
            return;
        }
        this.steps.forEach((x, i) => {
            if (i > index) {
                delete x.complete;
            }
        });
        this.currentStep = step;
        window.scroll(0, 0);
    }

    goBack(step) {
        const index = this.steps.findIndex(x => x.key === step);
        delete this.steps[index].complete;
        if (index <= 0) {
            this.router.navigate(['/', 'cart']);
        } else {
            const stepObj = this.steps[index - 1];
            this.currentStep = stepObj.key;
        }
        window.scroll(0, 0);
    }

    goNext(step) {
        const index = this.steps.findIndex(x => x.key === step);
        if (index === -1) {
            this.router.navigate(['/', 'cart']);
        }
        const stepObj = this.steps[index + 1];
        if (stepObj && stepObj.key) {
            this.steps[index].complete = 1;
            this.currentStep = stepObj.key;
        } else {
            this.router.navigate(['/', 'checkout-success']);
        }
        window.scroll(0, 0);
    }

    goCheckoutStep(step) {
        const index = this.steps.findIndex(x => x.key === step);
        if (step === 'cart' || index === -1) {
            this.router.navigate(['/', 'cart']);
            return;
        }
        this.currentStep = step;
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needDestroyServices.forEach(sub => {console.log(sub);
            if (sub) {
                sub.unsubscribe();
            }
        });
    }
}
