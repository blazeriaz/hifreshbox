import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute,
  Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ProductsService, AlertService, RestDefaultService } from 'services';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as GlobalVariable from '../../global';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'form.component.html'
})
export class SwagFormComponent implements OnInit, OnDestroy {
  @ViewChild('savemodal') saveModal: TemplateRef<any>;
  @ViewChild('editLoadModal') editLoadModal: TemplateRef<any>;

  swag: any;
  swagForm: any;
  customAttributes: any;
  ingredientsOptions: any;
  ingredients: any;
  newIngredient: any;
  swagSteps: any;
  newSwagStep: any;
  submitted: any;
  images: any;
  imageUploadConfig: DropzoneConfigInterface;
  serverImagesLoading;
  addImageIndex;
  imagesDropZone;
  updatingMessage;
  saveModalClose;
  abortModalClose;
  saveRequests;
  public modalRef: BsModalRef;
  modalEditRef: BsModalRef;
  serverMediaImages;
  loadedFormData;
  countLoadedFormReqs;
  loadFormRequests;
  needToDestroyEvents = [];
  destroyed;
  constructor(
    private swagsService: ProductsService,
    private rest: RestDefaultService,
    private alert: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
    private modalService: BsModalService
  ) {
    this.needToDestroyEvents.push(router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    }));
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.destroyed = true;
    }
    if (event instanceof NavigationEnd) {
    }
    if (event instanceof NavigationCancel) {
    }
    if (event instanceof NavigationError) {
    }
  }

  ngOnInit(): void {
    this.swag = {};
    this.images = [];
    this.addImageIndex = 0;
    this.serverImagesLoading = false;
    this.saveModalClose = false;
    this.abortModalClose = false;
    this.serverMediaImages = [];

    this.loadFormRequests = [];
    this.countLoadedFormReqs = 0;
    this.loadedFormData = false;

    this.loadFormData();
    this.loadMediaImages();
    if (this.loadFormRequests.length === 0) {
      this.checkAllFormDataLoaded();
    } else {
      this.openEditModal();
    }
    this.destroyed = false;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  openEditModal() {
    this.modalEditRef = this.modalService.show(this.editLoadModal, {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  abortEdit() {
    if (this.loadFormRequests && this.loadFormRequests.length > 0) {
      this.loadFormRequests.map(sub => sub ? sub.unsubscribe() : '');
    }
    this.modalEditRef.hide();
    this.goToList();
  }

  checkAllFormDataLoaded() {
    if (--this.countLoadedFormReqs <= 0) {
      this.modalEditRef ? this.modalEditRef.hide() : (function(){})();
      this.initEditForm();
      this.initImagesDropZone();
      this.loadedFormData = true;
    }
  }

  loadFormData() {
    const swagSku = this.route.snapshot.params['sku'];
    this.swag = {};
    if (!swagSku) {
      return;
    }
    this.swag.sku = swagSku;
    this.loadFormRequests.push(
      this.rest.getItem(swagSku, 'products/' + swagSku).subscribe(swag => {
        this.swag = swag;
        this.checkAllFormDataLoaded();
      })
    );
    this.countLoadedFormReqs++;
  }

  loadMediaImages() {
    const swagSku = this.route.snapshot.params['sku'];
    if (!swagSku) {
      return;
    }
    this.loadFormRequests.push(
      this.rest.getItem('', 'products-gal/' + swagSku + '/media')
        .subscribe(images => {
          this.serverMediaImages = images;
          this.checkAllFormDataLoaded();
        },
        error => {
        this.checkAllFormDataLoaded();
        })
    );
    this.countLoadedFormReqs++;
  }

  initImagesDropZone() {
    this.imageUploadConfig = {
      url: 'https://httpbin.org/post',
      acceptedFiles: 'image/*',
      addRemoveLinks: true,
      accept : (function(ctrl){
        return function(file) {
          file.addedIndex = ctrl.addImageIndex;
          ctrl.images.push(file);
          ctrl.addImageIndex++;
        }
      })(this),
      init : (function(ctrl){
        return function() {
          ctrl.attachMediaImagesToDropzone(this);
        }
      })(this)
    };
  }

  attachMediaImagesToDropzone(imagesDropZone) {
    this.imagesDropZone = imagesDropZone;
    if (!this.swag || !this.swag.custom_attributes || this.serverMediaImages.length == 0) {
      return;
    }
    this.serverMediaImages.map(image => {
      const mockFile = {
        name: image.label,
        entry : image,
        accepted: true,
        previewTemplate : document.createElement('div')
      };
      imagesDropZone.emit('addedfile', mockFile);
      imagesDropZone.emit('thumbnail', mockFile, image.file.resized);
      imagesDropZone.emit('success', mockFile);
      imagesDropZone.emit('complete', mockFile);
      imagesDropZone.files.push(mockFile);
      this.removeFileSizeElement(mockFile);
    });
  }

  removeFileSizeElement(mockFile) {
    const fileSizeElement = mockFile.previewTemplate.querySelector('.dz-size');
    if (fileSizeElement) {
      fileSizeElement.parentNode.removeChild(fileSizeElement);
    }
  }

  initEditForm() {
    this.customAttributes = [];
    const customAttributesArray = [];
    ['description', 'order_shipping', 'return_policy'].map(attribute_code => {
      let value = '';
      if (this.swag && this.swag.custom_attributes) {
        const attribute = this.swag.custom_attributes.find(x => x.attribute_code == attribute_code);
        value = attribute ? attribute.value : '';
      };
      this.customAttributes.push(attribute_code);
      customAttributesArray.push(this.addCustomArrtibute(attribute_code, value, true));
    });
    customAttributesArray.push(this.addCustomArrtibute('category_ids', ['42'], false));

    const qty = this.swag.extension_attributes ? this.swag.extension_attributes.stock_item.qty : 0;
    this.swagForm = this._fb.group({
      name : [this.swag.name, [Validators.required]],
      status : this.swag.status ? this.swag.status : 1,
      visibility: 4,
      type_id : 'simple',
      price : [this.swag.price, [Validators.required]],
      attribute_set_id : 17,
      extension_attributes : this._fb.group({
        stock_item : this._fb.group({
          manage_stock : 1,
          is_in_stock : 1,
          qty : [qty, [Validators.required]]
        })
      }),
      custom_attributes : this._fb.array(customAttributesArray)
    });
  }

  removedfile(file) {
    setTimeout(() => {
      if (file.entry && file.entry.id && !this.destroyed) {
        this.rest.deleteItem('', 'products/' + this.swag.sku + '/media/' + file.entry.id).subscribe(
          res => res,
          error => {
            this.imagesDropZone.emit('addedfile', file);
            this.imagesDropZone.emit('thumbnail', file, file.entry.file.resized);
            this.imagesDropZone.emit('success', file);
            this.imagesDropZone.emit('complete', file);
            this.imagesDropZone.files.push(file);
          }
        );
      } else if (file.addedIndex >= 0) {
        this.images = this.images.filter(image => image.addedIndex !== file.addedIndex);
      }
    }, 100);
  }

  addCustomArrtibute(attribute_code, value, required) {
    if (attribute_code === 'category_ids') {
      value = this._fb.array(value);
    }
    if (required) {
      value = [value, Validators.required];
    }

    return this._fb.group({
      attribute_code : attribute_code,
      value : value
    });
  }

  getCustomAttributeIndex(attribute_code) {
    return this.customAttributes.indexOf(attribute_code);
  }

  getCustomAttributeValue(attribute_code) {
    const index = this.getCustomAttributeIndex(attribute_code);
    if (index >= 0) {
      const controls = this.swagForm.controls['custom_attributes'].controls;
      return controls[index].get('value').value;
    }
    return '';
  }

  setStatus(status) {
      this.swagForm.patchValue({status : status});
  }

  getStatus() {
      return this.swagForm.value.status;
  }

  setStatusClass(type) {
      if (this.getStatus() === type) {
          return 'btn-primary';
      } else {
          return 'btn-secondary';
      }
  }

  setInputErrorClass(input) {
    const invalid = this.swagForm.get(input).invalid && this.submitted;
    if (invalid) {
      return 'form-control-danger';
    }
  }

  setContainerErrorClass(input) {
    const invalid = this.swagForm.get(input).invalid && this.submitted;
    if (invalid) {
      return 'has-danger';
    }
  }

  setAttrInputErrorClass(attribute_code) {
    const index = this.getCustomAttributeIndex(attribute_code);
    let invalid = false;
    if (index >= 0) {
      invalid = this.swagForm.controls['custom_attributes'].controls[index].invalid && this.submitted;
    }
    if (invalid) {
      return 'form-control-danger';
    }
  }

  setAttrContainerErrorClass(attribute_code) {
    const index = this.getCustomAttributeIndex(attribute_code);
    let invalid = false;
    if (index >= 0) {
      invalid = this.swagForm.controls['custom_attributes'].controls[index].invalid && this.submitted;
    }
    if (invalid) {
      return 'has-danger';
    }
  }

  setQtyInputErrorClass() {
    const invalid = this.swagForm.controls['extension_attributes'].controls['stock_item'].controls['qty'].invalid && this.submitted;
    if (invalid) {
      return 'form-control-danger';
    }
  }

  setQtyContainerErrorClass() {
    const invalid = this.swagForm.controls['extension_attributes'].controls['stock_item'].controls['qty'].invalid && this.submitted;
    if (invalid) {
      return 'has-danger';
    }
  }

  saveSwag() {
    this.alert.clear();
    this.submitted = true;
    if (this.swagForm.valid) {
      let swagSku = this.route.snapshot.params['sku'];

      const sendData = this.swagForm.value;
      let saveUrl = 'products';
      if (!swagSku) {
        swagSku = '';
        sendData.sku = GlobalVariable.getRandomInt(10000, 99999);
      } else {
        saveUrl += '/' + swagSku;
      }
      this.updatingMessage = 'Uploading the Swag information...';
      this.saveModalClose = false;
      this.abortModalClose = true;
      this.openSaveModal();
      this.saveRequests = [];
      this.saveRequests.push(this.rest.saveItem(swagSku, {product : sendData}, saveUrl).subscribe(data => {
        if (this.images.length === 0) {
          this.updatingMessage = 'The Swag information saved successfully!'; 
          this.saveModalClose = true;
          this.abortModalClose = false;
          this.modalRef.hide();
          this.goToList();
          return;
        }
        this.updatingMessage = 'Uploading the Swag images...';
        const totalImages = this.images.length;
        this.images.map(image => {
          const base64 = image.dataURL.split('base64,');
          const image_upload = {
            media_type: 'image',
            label: image.name,
            position: 0,
            disabled: 0,
            types: ['image', 'small_image', 'thumbnail', 'swatch_image'],
            file: image.name,
            content: {
              base64_encoded_data: base64[1],
              type: image.type,
              name: image.name
            }
          };
          this.saveRequests.push(this.swagsService.saveProductImage(data.sku, image_upload).subscribe(x => {
            const i = this.images.indexOf(image);
            this.images.splice(i, 1);
            this.updatingMessage = 'Uploading the Swag images... '
                  + (totalImages - this.images.length) + ' / ' + totalImages + ' Images uploaded!';
            if (this.images.length === 0) {
              this.updatingMessage = 'The Swag information and images saved successfully!';
              this.saveModalClose = true;
              this.abortModalClose = false;
              this.modalRef.hide();
              this.goToList();
            }
            image.entry = {};
            image.entry.id = x;
            this.imagesDropZone.emit('success', image);
            this.imagesDropZone.emit('complete', image);
          }));
        });
      }));
    } else {
      this.alert.error('Please check the form to enter all required details');
    }
  }

  openSaveModal() {
    this.modalRef = this.modalService.show(this.saveModal, {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  abortSave() {
    if (this.saveRequests && this.saveRequests.length > 0) {
      this.saveRequests.map(sub => sub ? sub.unsubscribe() : '');
    }
    this.modalRef.hide();
  }

  goToList() {
    this.router.navigate(['swags']);
  }
}
