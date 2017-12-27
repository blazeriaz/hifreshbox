import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { RestService, AlertService, PagerService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class IngredientsListComponent implements OnInit, OnDestroy {
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
            field: 'creation_time',
            direction: 'DESC'
        }];
        
        this.loadingList = true;
        this.searchSubscripe = this.restService.getItems(pageNo, filters, pageSize, 'ingredients/search', 'criteria').subscribe(items => {
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
        const sendData = {ingredient: {is_active: (item.is_active) ? 0 : 1}};
        this.loadingSave = true;
        this.restService.saveItem(item.id, sendData, 'ingredients/' + item.id).subscribe(data => {
            if (data) {
                this.alert.success('The ingredient status changed successfully!');
                item.is_active = !item.is_active;
            } else {
                this.alert.error('Something went wrong!');
            }
            this.loadingSave = false;
        }, err => {
            this.alert.error('Something went wrong!');
            this.loadingSave = false;
        });
    }

    deleteItem(item) {
        if (!confirm('Are you sure to delete the ingredient?')) {
            return;
        }
        this.alert.clear();
        this.restService.deleteItem(item.id, 'ingredients/' + item.id).subscribe(r => {
            this.loadItemsList(this.pager.currentPage);
            this.alert.success('The ingredient had been deleted successfully!');
        }, e => {
            this.alert.error('Something went wrong!');
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
            const url = itemId ? 'ingredients/' + itemId : 'ingredients';
            this.restService.saveItem(itemId, {ingredient: form.value}, url).subscribe(
                data => {
                    this.alert.success('The ingredient are saved successfully!', true);                    
                    if(changedItem) {
                        changedItem.title = form.value.title;
                    }
                    this.editItem = false;
                    this.submitted = false;
                    form.patchValue({
                        title : ''
                    });
                    this.loadItemsList(this.pager.currentPage);
                    this.loadingSave = false;
                },
                e => this.loadingSave = false
            );
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }
}
