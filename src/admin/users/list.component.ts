import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService, PagerService } from "services";

export const pageSize = 10;

@Injectable()
export class customerListResolve implements Resolve<any> {
  
  constructor(private usersService: UsersService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.usersService.getUsers(1, [], pageSize);
  }
}

@Component({
    templateUrl: 'list.component.html'
})
export class UsersListComponent implements OnInit {
    public users:any;
    public pager: any;

    constructor(private usersService: UsersService, 
        private alert: AlertService,
        private pagerService: PagerService,
        public route: ActivatedRoute,
        public router: Router ) { }
    
    ngOnInit(): void {
        let users = this.route.snapshot.data['users'];
        this.initUsersList(users);
    }

    initUsersList(users, page?) {
        this.users = users.items;
        for (let user of this.users){
            user.default_shipping = user.addresses.find(x => x.default_shipping == 1);
            user.default_billing = user.addresses.find(x => x.default_shipping == 1);
        }
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(users.total_count, page, pageSize);
    }

    setPage(page) {
        this.usersService.getUsers(page, [], pageSize).subscribe(users => {
            this.initUsersList(users, page);
        });
    }

    deleteUser(userId) {
        if(!confirm("Are you sure to delete the customer?")) {
            return;
        }
        this.alert.clear();
        this.usersService.deleteUser(userId).subscribe(data => {
            if(data) {
                this.alert.success("The customer deleted successfully!", true);
                let page = 1;
                this.usersService.getUsers(page, [], pageSize).subscribe(users => {
                    this.initUsersList(users, page);
                });
            } else {
                this.alert.error("The customer can't be deleted!", true);
            }
        });
    }
}
