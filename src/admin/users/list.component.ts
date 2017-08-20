import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService } from "services";

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

    constructor(private usersService: UsersService, 
        private alert: AlertService,
        public route: ActivatedRoute,
        public router: Router ) { }
    
    ngOnInit(): void {
        let users = this.route.snapshot.data['users'];
        this.initUsersList(users);
    }

    initUsersList(users) {
        users = users.items;
        for (let user of users){
            user.default_shipping = user.addresses.find(x => x.default_shipping == 1);
            user.default_billing = user.addresses.find(x => x.default_shipping == 1);
        }
        this.users =  users;
    }

    deleteUser(userId) {
        if(!confirm("Are you sure to delete the customer?")) {
            return;
        }
        this.alert.clear();
        this.usersService.deleteUser(userId).subscribe(data => {
            if(data) {
                this.alert.success("The customer deleted successfully!", true);
                this.usersService.getUsers().subscribe(users => {
                    this.initUsersList(users);
                });
            } else {
                this.alert.error("The customer can't be deleted!", true);
            }
        });
    }

    reload() {
        this.router.navigate(['**'], {skipLocationChange: true});
        setTimeout(function(){
            this.router.navigate(['users']); 
        }.bind(this), 50);
    }
}
