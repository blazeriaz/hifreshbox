import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { RestService, AlertService, PagerService } from "services";

export const pageSize = 10;
export const filterGroups = [{
    filters : [{
        field : "attribute_set_id",
        value : 17,
        condition_type : 'eq'
    }]
}];

@Injectable()
export class swagsListResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    this.rest.setRestModule('products');
    return this.rest.getItems(1, filterGroups, pageSize);
  }
}

@Component({
    templateUrl: 'list.component.html'
})
export class SwagsListComponent implements OnInit {
    private swags:any;
    private pager: any;

    constructor(private rest: RestService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router ) {
        this.rest.setRestModule('products');
    }
                
    ngOnInit(): void {
        let swags = this.route.snapshot.data['swags'];        
        this.initSwagsList(swags);
    }

    initSwagsList(swags, page?) {
        this.swags = swags.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(swags.total_count, page, pageSize);        
    }

    setPage(page) {
        this.rest.getItems(page, filterGroups, pageSize).subscribe(swags => {
            this.initSwagsList(swags, page);
        });
    }

    deleteReceipe(swagSku) {
        if(!confirm("Are you sure to delete the swag?")) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(swagSku).subscribe(data => {
            if(data) {
                this.alert.success("The swag deleted successfully!", true);
                this.rest.getItems(1, filterGroups, pageSize).subscribe(swags => {
                    this.initSwagsList(swags);
                });
            } else {
                this.alert.error("The swag can't be deleted!", true);
            }
        });
    }
}
