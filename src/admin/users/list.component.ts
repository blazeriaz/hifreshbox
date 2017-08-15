import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService } from "services";

@Injectable()
export class customerListResolve implements Resolve<any> {
  
  constructor(private usersService: UsersService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    let userId = route.params['id'];
    return this.usersService.getUsers();
  }
}

@Component({
    templateUrl: 'list.component.html'
})
export class UsersListComponent implements OnInit {
    public users:any;

    constructor(private usersService: UsersService, public route: ActivatedRoute ) { }
    
    ngOnInit(): void {
        let users = this.route.snapshot.data['users'];
        users = users.items;
        for (let user of users){
            user.default_shipping = user.addresses.find(x => x.default_shipping == 1);
            user.default_billing = user.addresses.find(x => x.default_shipping == 1);
        }
        this.users =  users;
    }
}
