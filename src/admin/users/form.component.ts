import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService } from "services";
import { FormBuilder, Validators } from "@angular/forms";

@Injectable()
export class customerEditResolve implements Resolve<any> {
  
  constructor(private usersService: UsersService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    let userId = route.params['id'];
    return this.usersService.getUser(userId);
  }
}

@Component({
    templateUrl: 'form.component.html'
})
export class UserFormComponent implements OnInit {
    user:any;
    userAccountForm: any;

    constructor(private usersService: UsersService, 
                private alert: AlertService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute ) {
        this.user = {firstname:'', lastname: '', email: '', gender:''};

        this.userAccountForm = this.formBuilder.group({
            'firstname': ['', Validators.required],
            'lastname': ['', [Validators.required]],
            'email': ['', [Validators.required, Validators.email]],
            'gender': ['', [Validators.required]]
        });
    }
    
    ngOnInit(): void { 
        let userId = this.route.snapshot.params['id'];
        if(userId) {
            this.user = this.route.snapshot.data['user'];
        }
    }

    saveUser() {
        this.alert.clear();
        let userId = this.route.snapshot.params['id'];
        userId = (userId)?userId:'';
        let customerSave = {...this.userAccountForm.value, storeId: 1, websiteId: 1};
        this.usersService.saveUser(userId, {customer: customerSave}).subscribe(
            data => {
                this.user = data;
            }
        );
    }
}
