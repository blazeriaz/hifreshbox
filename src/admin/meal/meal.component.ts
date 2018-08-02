import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RestService, AlertService } from 'services';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  templateUrl: 'meal.component.html'
})
export class MealComponent implements OnInit {
  @ViewChild('optionFormTpl') optionFormTpl: TemplateRef<any>;
  @ViewChild('mealPrefFormTpl') mealPrefFormTpl: TemplateRef<any>;

  customOptionForm: FormGroup;
  customOptionValueForm: FormGroup;
  menuForm: FormGroup;
  menuItem;
  preferences;
  submitted;
  optionForm;
  modalOptionFormRef;
  modalPrefFormRef;
  loading;

  constructor(
    private _fb: FormBuilder,
    private alert: AlertService,
    private rest: RestService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    /**this.menuForm = this._fb.group({
        name : ['', [Validators.required]],
        price: ['', [Validators.required]],
    });**/

    this.optionForm = this._fb.group({
      preference_option_id: 0,
      preference_id: 0,
      title: ['', [Validators.required]],
      price: [0, [Validators.required]],
      qty_enabled: 1,
      sort_order: 0,
      is_active: 1
    });
    
    const mealSku = this.route.snapshot.params['sku'];
    this.customOptionForm = this._fb.group({
      'product_sku': mealSku,
      'option_id': null,
      'type': 'checkbox',
      'is_require': 0,
      'title': ['', [Validators.required]],
      'display_title': ['', [Validators.required]]
    });
    this.customOptionValueForm = this._fb.group({
      'option_id': null,
      'option_type_id': null,
      'price_type': 'fixed',
      'sort_order': 0,
      'title': ['', [Validators.required]],
      'price': ['', [Validators.required]]
    });
    this.rest.getItem('', 'products/' + mealSku).subscribe(data => {
        this.menuItem = data;
        //this.menuForm.patchValue({name: data.name, price: data.price});
    });

    /**this.rest.getItems(1, [], 1000, 'meals/search', 'criteria').subscribe(res => {
        this.preferences = res.items;
    });**/
  }

  openOptionForm(preference, option?) {
    if (option) {
      this.customOptionValueForm.patchValue({
        option_id: preference.option_id,
        option_type_id: option.option_type_id,
        title: option.title,
        price: option.price,
        sort_order: parseInt(option.sort_order, 10)
      });
    } else {
      this.customOptionValueForm.patchValue({
        option_id: preference.option_id,
        option_type_id: null,
        title: '',
        price: 0,
        sort_order: 0
      });
    }
    this.modalOptionFormRef = this.modalService.show(this.optionFormTpl, {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  saveMealOption() {
      this.alert.clear();
      this.submitted = true;
      if (this.customOptionValueForm.valid) {
        const optionValue = Object.assign({}, this.customOptionValueForm.value);
        const optionData = {
          preference: Object.assign({}, this.menuItem.options.find(x => x.option_id === optionValue.option_id)),
          modalRef: this.modalOptionFormRef,
          successMsg: 'The meal preference option saved successfully!'
        };
        
        delete optionValue.option_id;
        let valIndex = -1;
        if(optionValue.option_type_id) {
          valIndex = optionData.preference.values.findIndex(x => x.option_type_id === optionValue.option_type_id);
        }
        if(valIndex !== -1) {
          optionData.preference.values[valIndex] = optionValue;
        } else {
          optionData.preference.values.push(optionValue);
        }
        this.saveCustomOption(optionData);      
      } else {
        this.alert.error('Please check the form to enter all required details', false, "popup");
      }
  }

  deleteMealOption(preference, option) {    
    this.alert.clear();
    if (!confirm('Are you sure want to delete the option?')) {
      return;
    }
    const optionData = {
      preference: Object.assign({}, preference),
      successMsg: 'The meal preference option deleted successfully!'
    };
    optionData.preference.values = optionData.preference.values.filter(x => x.option_type_id !== option.option_type_id);
    this.saveCustomOption(optionData); 
  }
  
  toggleMealOptionStatus(preference, mealOption, status) {
    if (!confirm('Are you sure want to change the status of meal option?')) {
      return;
    }
    this.alert.clear();
    mealOption.statusLoading = true;
    const option_id = mealOption.preference_option_id;
    this.rest.saveItem(true, {preference_options : {is_active: status}}, 'meals-option/' + option_id).subscribe(data => {
      mealOption.is_active = data.is_active;
      this.alert.success('The meal option status changed successfully!', true);
      mealOption.statusLoading = false;
    }, e => {
      this.alert.error('The meal option status was not changed!', true);
      mealOption.statusLoading = false;
    });
  }

  openMealPrefForm(preference?) {
    if (preference) {
      const title = preference.title.split("|");
      this.customOptionForm.patchValue({
        option_id: preference.option_id,
        sort_order: preference.sort_order,
        title: title.length > 0 ? title[0] : '',
        display_title: title.length > 1 ? title[1] : '',
        type: preference.type,
        is_require: preference.is_require ? '1' : '0'
      });
    } else {
      this.customOptionForm.patchValue({
        option_id: 0,
        title: '',
        display_title: '',
        type: 'checkbox',
        is_require: '0'
      });
    }
    this.modalPrefFormRef = this.modalService.show(this.mealPrefFormTpl, {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  saveMealPref() {
    this.alert.clear();
    this.submitted = true;
    if (this.customOptionForm.valid) {
      const sendData = Object.assign({}, this.customOptionForm.value);
      const optionId = sendData.option_id;
      let menuOption = null; let options;
      if(optionId) {        
        menuOption = this.menuItem.options.find(x => x.option_id === optionId);        
      }
      if(!menuOption) {
        sendData.sort_order = this.menuItem.options.length + 1;
        options = [{
          title: 'Option',
          price: 0,
          price_type: 'fixed'
        }];
      } else {
        options = menuOption.values;
      }
      sendData.title += "|" + sendData.display_title;
      delete sendData.display_title;
      const optionData = {
        preference: sendData,
        modalRef: this.modalPrefFormRef,
        successMsg: 'The meal preference saved successfully!'
      };
      optionData.preference.values = options;
      this.saveCustomOption(optionData);
    } else {
        this.alert.error('Please check the form to enter all required details', false, 'popup');
    }
  }

  deleteMealPref(preference_id, force?) {
    if (!force && !confirm('Are you sure want to delete the preference?')) {
      return;
    }
    if(!force) this.alert.clear();
    this.rest.showLoader();
    this.rest.deleteItem(preference_id, 'products/' + this.menuItem.sku + '/options/' + preference_id).subscribe(x => {
      this.menuItem.options = this.menuItem.options.filter(y => y.option_id !== preference_id);
      if(!force) this.alert.success('The meal preference delete successfully!', true);
      this.rest.hideLoader();
    });
  }

  saveCustomOption(optionData) {
    let url = 'products/options';
    const optionId = optionData.preference.option_id;
    if (optionId) {
      url += '/' + optionId;
      if(optionData.preference.values.length <= 0) {
        this.deleteMealPref(optionId, true);
        this.alert.success(optionData.successMsg, true);
        return;
      }
    }
    optionData.preference.values.map(x => {
      x.price_type = 'fixed';
      x.price = parseInt(x.price, 10);
      return x;
    });
    this.loading = true;
    this.rest.showLoader();
    this.rest.saveItem(optionId, {option: optionData.preference}, url).subscribe(resData => {
      if(optionId && resData.option_id !== optionId) {      
        this.rest.deleteItem(optionId, 'products/' + this.menuItem.sku + '/options/' + optionId).subscribe(x => {
          this.rest.getItem('', 'products/' + this.menuItem.sku).subscribe(proData => {        
            this.alert.success(optionData.successMsg, true);
            this.loading = false;
            this.menuItem = proData;
            if(optionData.modalRef) this.closeEditModal(optionData.modalRef);
            this.rest.hideLoader();
          });
        });    
      } else {
        this.rest.getItem('', 'products/' + this.menuItem.sku).subscribe(proData => {        
          this.alert.success(optionData.successMsg, true);
          this.loading = false;
          this.menuItem = proData;
          if(optionData.modalRef) this.closeEditModal(optionData.modalRef);
          this.rest.hideLoader();
        });
      }
    }, e => {
      this.loading = false;
      this.rest.hideLoader();
    })
  }
  
  toggleMealPreftatus(preference, status) {
    if (!confirm('Are you sure want to change the status of meal pereference?')) {
      return;
    }
    this.alert.clear();
    preference.statusLoading = true;
    this.rest.saveItem(true, {preference : {is_active: status}}, 'meals/' + preference.id).subscribe(data => {
      preference.is_active = data.is_active;
      this.alert.success('The meal pereference status changed successfully!', true);
      preference.statusLoading = false;
    }, e => {
      this.alert.error('The meal pereference status was not changed!', true);
      preference.statusLoading = false;
    });
  }

  saveMealMenu() {
      this.alert.clear();
      this.submitted = true;
      if (this.menuForm.valid) {
        const sendData = this.menuForm.value;
        this.loading = true;
        this.rest.saveItem('category-1', {product : sendData}, 'products/category-1').subscribe(data => {
          this.submitted = false;
          this.alert.success('The menu details are updated successfully!', true);
          this.loading = false;
        }, e => {
          this.loading = false;
        })
      } else {
          this.alert.error('Please check the form to enter all required details');
      }
  }

  closeEditModal(modalRef) {
    this.submitted = false;
    this.loading = false;
    modalRef.hide();
  }

  setFormFieldButton(input, form, value) {
    const obj = {};
    obj[input] = value;
    form.patchValue(obj);
  }

  getClassFieldButton(input, form, value) {
    return (form.value[input] === value) ? 'btn-success' : 'btn-secondary';
  }

  setInputErrorClass(input, form) {
    const invalid = form.get(input).invalid && this.submitted;
    if (invalid) {
      return 'form-control-danger';
    }
  }

  setContainerErrorClass(input, form) {
    const invalid = form.get(input).invalid && this.submitted;
    if (invalid) {
      return 'has-danger';
    }
  }
}
