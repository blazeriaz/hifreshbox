import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { RestService, AlertService } from "services";
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from "@angular/forms";

@Injectable()
export class ingredientEditResolve implements Resolve<any> {
  
  constructor(private restService: RestService) {
      this.restService.setRestModule("ingredients");
  }
  
  resolve(route: ActivatedRouteSnapshot) {
    let itemId = route.params['id'];
    return this.restService.getItem(itemId);
  }
}

@Component({
    templateUrl: 'form.component.html'
})
export class IngredientsFormComponent implements OnInit {
    submitted:boolean;
    masterForm:any;
    masterItem:any;

    constructor(private restService: RestService, 
                private alert: AlertService,
                private _fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router ) {   
        this.restService.setRestModule("ingredients");
    }

    ngOnInit(): void {
        let itemId = this.route.snapshot.params['id'];
        this.masterItem = (itemId)?this.route.snapshot.data['item']:{};
        this.masterForm = this._fb.group({
            title : [this.masterItem.title, [Validators.required, Validators.minLength(3)]]
        });
    }

    setInputErrorClass(input) {
        let invalid = this.masterForm.get(input).invalid && this.submitted;
        if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
        let invalid = this.masterForm.get(input).invalid && this.submitted;
        if(invalid) return 'has-danger';
    }

    saveItem() {
        this.alert.clear();
        this.submitted = true;
        if (this.masterForm.dirty && this.masterForm.valid) {                   
            let itemId = this.route.snapshot.params['id'];
            itemId = (itemId)?itemId:'';
            this.restService.saveItem(itemId, {ingredient: this.masterForm.value}).subscribe(
                data => {
                    this.alert.success("The details are saved successfully!", true);
                    this.router.navigate(['users']);                    
                },
                error => {
                    if(error.status == 401) {
                        this.alert.error("Access restricted!");
                    } else {
                        this.alert.error("Server Error");
                    }
                    window.scrollTo(0,0);
                }
            );
        } else {
            this.alert.error("Please check the form to enter all required details");
            window.scrollTo(0,0);
        }
    }
}
