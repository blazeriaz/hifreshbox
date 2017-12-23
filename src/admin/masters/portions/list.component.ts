import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { RestService, AlertService, PagerService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class PortionsListComponent implements OnInit, OnDestroy {
    @ViewChildren('editInput') editInput;
    public items: any;
    public pager: any;

    submitted: any;
    masterForm: any;
    editItem: any;
    editForm = [];
    searchForm: any;
    searchSubscripe;
    loadingSave;
    loadingList;

    constructor(
        private restService: RestService,
        private alert: AlertService,
        private pagerService: PagerService,
        private _fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.masterForm = this._fb.group({
            title : ['', [Validators.required]]
        });

        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadItemsList(1));
        this.loadItemsList(1);
    }

    ngOnDestroy(): void {
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
    }

    loadItemsList(pageNo?) {
        const searchValues = this.searchForm.value;
        const filters = [];
        if (searchValues && searchValues.name) {
            filters.push({
                filters : [{
                    field : 'title',
                    value : '%' + searchValues.name + '%',
                    condition_type : 'like'
                }]
            });
        }
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        const sortOrders = [{
            field: 'created_at',
            direction: 'DESC'
        }];
        
        this.loadingList = true;
        this.searchSubscripe = this.restService.getItems(pageNo, filters, pageSize, 'portions/search', 'criteria').subscribe(items => {
            this.initItemsList(items, pageNo);
            this.loadingList = false;
        }, e => this.loadingList = false);
    }

    initItemsList(items, page?) {
        this.items = items.items;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(items.total_count, page, pageSize);
    }

    setPage(page) {
        this.loadItemsList(page);
    }

    toggleStatusItem(item) {
        if (!confirm('Are you sure to change the status?')) {
            return;
        }
        this.alert.clear();
        const sendData = {portion: {is_active: (item.is_active) ? 0 : 1}};
        this.loadingSave = true;
        this.restService.saveItem(item.id, sendData, 'portions/' + item.id).subscribe(data => {
            if (data) {
                this.alert.success('The portion status changed successfully!', true);
                item.is_active = !item.is_active;
            } else {
                this.alert.error('Somthing went wrong!', true);
            }
            this.loadingSave = false;
        }, err => {
            this.alert.error('Somthing went wrong!', true);
            this.loadingSave = false;
        });
    }

    setInputErrorClass(input, form, addForm) {
        if (addForm && this.editItem) {
            return '';
        }
        const invalid = form.get(input).invalid && this.submitted;
        return invalid ? 'form-control-danger' : '';
    }

    setContainerErrorClass(input, form, addForm) {
        if (addForm && this.editItem) {
            return '';
        }
        const invalid = form.get(input).invalid && this.submitted;
        return invalid ? 'has-danger' : '';
    }

    doEditItem(item) {
        if(this.loadingSave || this.loadingList) {
            return;
        }
        this.editItem = item;
        if(!this.editForm[item.id]) {
            this.editForm[item.id] = this._fb.group({
                title : ['', [Validators.required]]
            });
        }
        this.editForm[item.id].patchValue({
            title : item.title
        });
        setTimeout(() => {
            this.editInput.first.nativeElement.focus();
        }, 300);
        
    }

    checkItemOnEdit(item) {
        return this.editItem && item.id == this.editItem.id && this.editForm[item.id];
    }

    saveItem(form, changedItem) {
        this.alert.clear();
        this.submitted = true;
        if (form.valid) {
            this.loadingSave = true;
            const itemId = (this.editItem) ? this.editItem.id : '';
            const url = itemId ? 'portions/' + itemId : 'portions';
            this.restService.saveItem(itemId, {portion: form.value}, url).subscribe(
                data => {
                    this.alert.success('The portion are saved successfully!', true);
                    if(changedItem) {
                        changedItem.title = form.value.title;
                    }
                    this.editItem = false;
                    this.submitted = false;
                    form.patchValue({
                        title : ''
                    });
                    this.loadingSave = false;
                },
                e => this.loadingSave = false
            );
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }
}
