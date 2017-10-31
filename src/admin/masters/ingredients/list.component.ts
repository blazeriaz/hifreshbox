import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { RestService, AlertService, PagerService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

export const pageSize = 10;

@Injectable()
export class IngredientListResolve implements Resolve<any> {

  constructor(private restService: RestService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const sortOrders = [{
        field: 'title',
        direction: 'ASC'
    }];
    return this.restService.getItems(1, [], pageSize, 'ingredients/search', 'criteria');
  }
}

@Component({
    templateUrl: 'list.component.html'
})
export class IngredientsListComponent implements OnInit {
    public items: any;
    public pager: any;

    submitted: boolean;
    masterForm: any;
    editItem: any;

    constructor(private restService: RestService,
            private alert: AlertService,
            private pagerService: PagerService,
            private _fb: FormBuilder,
            public route: ActivatedRoute,
            public router: Router ) {
    }

    ngOnInit(): void {
        this.masterForm = this._fb.group({
            title : ['', [Validators.required, Validators.minLength(3)]]
        });
        const items = this.route.snapshot.data['items'];
        this.initItemsList(items);
    }

    initItemsList(items, page?) {
        this.items = items.items;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(items.total_count, page, pageSize);
    }

    setPage(page) {
        this.restService.getItems(page, [], pageSize, 'ingredients/search', 'criteria').subscribe(items => {
            this.initItemsList(items, page);
        });
    }

    toggleStatusItem(item) {
        if (!confirm('Are you sure to change the status?')) {
            return;
        }
        this.alert.clear();
        const sendData = {ingredient: {is_active: (item.is_active) ? 0 : 1}};
        this.restService.saveItem(item.id, sendData, 'ingredients/' + item.id).subscribe(data => {
            if (data) {
                this.alert.success('The ingredient status changed successfully!', true);
                this.setPage(1);
            } else {
                this.alert.error('Somthing went wrong!', true);
            }
        }, err => {
            this.alert.error('Somthing went wrong!', true);
        });
    }

    setInputErrorClass(input) {
        const invalid = this.masterForm.get(input).invalid && this.submitted;
        return invalid ? 'form-control-danger' : '';
    }

    setContainerErrorClass(input) {
        const invalid = this.masterForm.get(input).invalid && this.submitted;
        return invalid ? 'has-danger' : '';
    }

    doEditItem(item) {
        this.editItem = item;
        this.masterForm.patchValue({
            title : item.title
        });
    }

    saveItem() {
        this.alert.clear();
        this.submitted = true;
        if (this.masterForm.dirty && this.masterForm.valid) {
            const itemId = (this.editItem) ? this.editItem.id : '';
            const url = itemId ? 'ingredients/' + itemId : 'ingredients';
            this.restService.saveItem(itemId, {ingredient: this.masterForm.value}, url).subscribe(
                data => {
                    this.alert.success('The ingredient are saved successfully!', true);
                    this.editItem = false;
                    this.submitted = false;
                    this.masterForm.patchValue({
                        title : ''
                    });
                    this.setPage(1);
                }
            );
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }
}
