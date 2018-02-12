import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { RestService, AlertService, MealMenuService } from 'services';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  templateUrl: 'meal.component.html'
})
export class MealComponent implements OnInit {
  @ViewChild('optionFormTpl') optionFormTpl: TemplateRef<any>;
  @ViewChild('mealPrefFormTpl') mealPrefFormTpl: TemplateRef<any>;

  menuForm;
  menuItem;
  preferences;
  submitted;
  optionForm;
  mealPrefForm;
  modalOptionFormRef;
  modalPrefFormRef;
  loading;

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private alert: AlertService,
    private rest: RestService,
    private mealMenuService: MealMenuService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.menuForm = this._fb.group({
        name : ['', [Validators.required]],
        price: ['', [Validators.required]],
    });

    this.optionForm = this._fb.group({
      preference_option_id: 0,
      preference_id: 0,
      title: ['', [Validators.required]],
      price: [0, [Validators.required]],
      qty_enabled: 1,
      sort_order: 0,
      is_active: 1
    });

    this.mealPrefForm = this._fb.group({
      id: 0,
      title: ['', [Validators.required]],
      display_title: ['', [Validators.required]],
      is_active: 1
    });

    this.rest.getItem('', 'products/freshbox-subscription').subscribe(data => {
        this.menuItem = data;
        this.menuForm.patchValue({name: data.name, price: data.price});
    });

    this.rest.getItems(1, [], 1000, 'meals/search', 'criteria').subscribe(res => {
        this.preferences = res.items;
    });
  }

  openOptionForm(preference_id, option?) {
    this.optionForm.patchValue({
      preference_id: preference_id
    });
    if (option) {
      this.optionForm.patchValue({
        preference_option_id: option.preference_option_id,
        title: option.title,
        price: option.price,
        qty_enabled: parseInt(option.qty_enabled, 10),
        sort_order: parseInt(option.sort_order, 10),
        is_active: parseInt(option.is_active, 10)
      });
    } else {
      this.optionForm.patchValue({
        preference_option_id: 0,
        title: '',
        price: 0,
        qty_enabled: 1,
        sort_order: 0,
        is_active: 1
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
      if (this.optionForm.valid) {
        const sendData = Object.assign({}, this.optionForm.value);
        const option_id = sendData.preference_option_id;
        let url = 'meals-option';
        if (option_id) {
          url += '/' + option_id;
        }
        delete sendData.preference_option_id;
        this.loading = true;
        this.rest.saveItem(option_id, {preference_options : sendData}, url).subscribe(data => {
          this.alert.success('The preference option saved successfully!', true);
          this.rest.getItems(1, [], 1000, 'meals/search', 'criteria').subscribe(res => {
            this.preferences = res.items;
            this.loading = false;
            this.closeEditModal(this.modalOptionFormRef);
          });
        }, e => {
          this.loading = false;
        })
      } else {
        this.alert.error('Please check the form to enter all required details', false, "popup");
      }
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

  deleteMealOption(preference_id, option) {
    if (!confirm('Are you sure want to delete the option?')) {
      return;
    }
    const option_id = option.preference_option_id;
    this.rest.deleteItem(option_id, 'meals-option/' + option_id).subscribe(x => {
      const index = this.preferences.findIndex(y => y.id === preference_id);
      if (index !== -1) {
        this.preferences[index].options = this.preferences[index].options.filter(z => z.preference_option_id !== option_id);
      }
      this.alert.success('The preference options delete successfully!', true);
    });
  }

  openMealPrefForm(preference?) {
    if (preference) {
      this.mealPrefForm.patchValue({
        id: preference.id,
        title: preference.title,
        display_title: preference.display_title,
        is_active: parseInt(preference.is_active, 10)
      });
    } else {
      this.optionForm.patchValue({
        id: 0,
        title: '',
        is_active: 1
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
    if (this.mealPrefForm.valid) {
      const sendData = this.mealPrefForm.value;
      const preference_id = sendData.id;
      let url = 'meals';
      if (preference_id) {
        url += '/' + preference_id;
      }
      delete sendData.id;
      this.loading = true;
      this.rest.saveItem(preference_id, {preference : sendData}, url).subscribe(data => {
        this.alert.success('The meal preference saved successfully!', true);
        this.rest.getItems(1, [], 1000, 'meals/search', 'criteria').subscribe(res => {
          this.preferences = res.items;
          this.loading = false;
          this.closeEditModal(this.modalPrefFormRef);
        });
      }, e => {
        this.loading = false;
      })
    } else {
        this.alert.error('Please check the form to enter all required details', false, 'popup');
    }
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

  deleteMealPref(preference_id) {
    if (!confirm('Are you sure want to delete the preference?')) {
      return;
    }
    this.alert.clear();
    this.rest.deleteItem(preference_id, 'meals/' + preference_id).subscribe(x => {
      this.preferences = this.preferences.filter(y => y.id !== preference_id);
      this.alert.success('The meal preference delete successfully!', true);
    });
  }

  saveMealMenu() {
      this.alert.clear();
      this.submitted = true;
      if (this.menuForm.valid) {
        const sendData = this.menuForm.value;
        this.loading = true;
        this.rest.saveItem('freshbox-subscription', {product : sendData}, 'products/freshbox-subscription').subscribe(data => {
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
