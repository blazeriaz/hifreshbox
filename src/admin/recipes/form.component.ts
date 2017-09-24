import { Component, OnInit, Injectable, TemplateRef, ViewChild } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as GlobalVariable from "../../global";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
    templateUrl: 'form.component.html'
})
export class RecipeFormComponent implements OnInit {
  @ViewChild('savemodal') saveModal: TemplateRef<any>;
  @ViewChild('editLoadModal') editLoadModal: TemplateRef<any>;
    recipe:any;
    recipeForm:any;
    customAttributes:any;
    ingredientsOptions:any;
    ingredients:any;
    newIngredient:any;
    recipeSteps:any;
    newRecipeStep:any;
    customerNeeds:any;
    newCustomerNeed:any;
    allergies:any;
    newAllerigy:any;
    submitted:any;
    
    images;
    imageUploadConfig: DropzoneConfigInterface;
    serverMediaImages;    
    addImageIndex;
    imagesDropZone;
    updatingMessage;
    saveModalClose;
    abortModalClose;
    saveRequests;
    public modalRef: BsModalRef;

    pdfUploadConfig: DropzoneConfigInterface;
    serverPDFLoading;
    pdfDropZone;
    pdfDocument;

    loadedFormData;
    formAction;
    countLoadedFormReqs;
    loadFormRequests;
    modalEditRef;

    timeouts;

    constructor(
      private recipesService: ProductsService,
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder,
      private modalService: BsModalService
    ) {
    }
    
    ngOnInit(): void {
      this.ingredients = [];
      this.newIngredient = {};
      this.recipeSteps = [];
      this.customerNeeds = [];
      this.allergies = [];
      this.ingredientsOptions = null;
      this.images = [];
      this.serverMediaImages = [];
      this.loadFormRequests = [];
      this.countLoadedFormReqs = 0;

      this.timeouts = {};

      this.loadedFormData = false;
      this.loadIngredients();
      this.loadFormData();
      this.loadMediaImages();      
      this.openEditModal();
    }
    
    openEditModal() {
      let config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalEditRef = this.modalService.show(this.editLoadModal, config);
    }
    
    abortEdit() {
      if(this.loadFormRequests && this.loadFormRequests.length > 0) {
        this.loadFormRequests.map(sub=>sub?sub.unsubscribe():'');
      }
      this.modalEditRef.hide();
      this.goToList();
    }

    checkAllFormDataLoaded() {      
      if(--this.countLoadedFormReqs == 0) {
        this.modalEditRef.hide();
        this.initEditForm();        
        this.initPdfDropZone();
        this.initImagesDropZone();
        this.loadedFormData = true; 
      }
    }

    loadFormData() {
      let recipeSku = this.route.snapshot.params['sku'];
      this.recipe = {};
      this.formAction = 'Add';
      if(!recipeSku) return;
      this.formAction = 'Edit';
      this.loadFormRequests.push(
        this.rest.getItem(recipeSku, 'products/' + recipeSku).subscribe(recipe => {
          this.recipe = recipe;
          this.checkAllFormDataLoaded();
        })
      );
      this.countLoadedFormReqs++;
    }

    loadIngredients() {
      this.loadFormRequests.push(
        this.recipesService.getIngredienOptions().subscribe(data => {
          this.ingredientsOptions = {};
          let options = data[0];
          this.ingredientsOptions.ingredients = options.ingredients.map(ingredient => {
            return {id: ingredient.ingredient_id, text: ingredient.title}
          });
          this.ingredientsOptions.portions = options.portions.map(portion => {
            return {id: portion.portion_id, text: portion.title}
          });
          this.checkAllFormDataLoaded();
        })
      );
      this.countLoadedFormReqs++;
    }
    
    loadMediaImages() {
      let recipeSku = this.route.snapshot.params['sku'];
      if(!recipeSku) return;
      this.loadFormRequests.push(
        this.rest.getItem('', 'products-gal/'+recipeSku+'/media')
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
    
    initEditForm() {
      this.customAttributes = [];
      let customAttributesArray = [];
      ["description", "chef_name", "servings", "cooking_time", "calories", "protein", "carb", "fat"].map(attribute_code => {
        let value = '';
        if(this.recipe && this.recipe.custom_attributes) {
          let attribute = this.recipe.custom_attributes.find(x => x.attribute_code == attribute_code);
          value = attribute?attribute.value:'';
        };
        this.customAttributes.push(attribute_code);
        customAttributesArray.push(this.addCustomArrtibute(attribute_code, value, true));
      });

      ['ingredients', 'steps', 'customer_needs', 'allergies'].map(attribute_code => {
        let value: any = [];
        if (this.recipe && this.recipe.custom_attributes) {
          let attribute = this.recipe.custom_attributes.find(x => x.attribute_code === attribute_code);
          value = attribute ? attribute.value : '';
        };
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = [];
        }
        if (attribute_code === 'ingredients') {
          this.ingredients = value;
        }
        if (attribute_code === 'steps') {
          this.recipeSteps = value;
        }
        if (attribute_code === 'customer_needs') {
          this.customerNeeds = value;
        }
        if (attribute_code === 'allergies') {
          this.allergies = value;
        }
      });

      customAttributesArray.push(this.addCustomArrtibute('category_ids', ['41'], false));
      this.recipeForm = this._fb.group({
        name : [this.recipe ? this.recipe.name : '', [Validators.required, Validators.minLength(5)]],
        visibility: 1,
        type_id : 'simple',
        price : 0,
        status : 1,
        attribute_set_id : 16,
        extension_attributes : this._fb.group({
          stock_item : this._fb.group({
            manage_stock : 0,
            is_in_stock : 1,
            qty : 0
          })
        }),
        custom_attributes : this._fb.array(customAttributesArray)
      });
    }

    initPdfDropZone() {
      this.pdfUploadConfig = {
        acceptedFiles: 'application/pdf',
        addRemoveLinks: true,
        accept : (function(ctrl){
          return function(pdf) {
            if (pdf && !pdf.saved) {
              const reader = new FileReader();
              reader.onload = handleReaderLoad;
              reader.readAsDataURL(pdf);
            }
            function handleReaderLoad(evt) {
              pdf.data64 = evt.target.result;
            }
            console.log(this.files);
            console.log(pdf);
            this.files.map(file => {
              if (pdf !== file) {
                this.removeFile(file);
              }
            });
            this.emit('thumbnail', pdf, GlobalVariable.pdfDataURL);
            ctrl.removeFileSizeElement(pdf);
            ctrl.pdfDocument = pdf;
          }
        })(this),
        init : (function(ctrl){
          return function() {
            ctrl.attachPdfDocumentToDropzone(this);
          }
        })(this)
      };
    }

    attachPdfDocumentToDropzone(pdfDropZone) {
      if(this.pdfDropZone) return;
      this.pdfDropZone = pdfDropZone;
      if(!this.recipe || !this.recipe.custom_attributes || this.recipe.custom_attributes.length == 0) {
        return;
      }
      let ctrl = this;
      clearTimeout(this.timeouts.initPdf);
      this.timeouts.initPdf = setTimeout(() => {
        let i = ctrl.recipe.custom_attributes.findIndex(attr => {
          return attr.attribute_code == "pdf_upload";
        });
        if(i >= 0) {
          let pdf_file_name = ctrl.recipe.custom_attributes[i].value;
          let mockFile = { 
            name: pdf_file_name,
            accepted: true,
            type: 'application/pdf',
            saved: true,
            previewTemplate : document.createElement('div')
          }; 
          ctrl.pdfDropZone.addFile(mockFile);          
          ctrl.pdfDropZone.emit("success", mockFile);
          ctrl.pdfDropZone.emit("complete", mockFile);
          ctrl.removeFileSizeElement(mockFile);
          //ctrl.appendPDFDownloaLink(mockFile, pdf_file_name);
        }      
      }, 2000);
    }

    removeFileSizeElement(mockFile) {
      let fileSizeElement = mockFile.previewTemplate.querySelector(".dz-size");
      if(fileSizeElement) {
        fileSizeElement.parentNode.removeChild(fileSizeElement);
      }
    }

    appendPDFDownloaLink(mockFile, pdf_file_name) {
      let a = document.createElement('a');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', GlobalVariable.BASE_MEDIA + "recipe-pdf/" + pdf_file_name);
      a.innerHTML = "Download";
      a.className = 'dz-remove';
      mockFile.previewTemplate.appendChild(a);
    }

    initImagesDropZone() {
      this.imageUploadConfig = {
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        accept : (function(ctrl){
          return function(file) {
            file.addedIndex = ctrl.addImageIndex;
            ctrl.images.push(file);
            ctrl.addImageIndex++;
            ctrl.removeFileSizeElement(file);
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
      if(!this.recipe || !this.recipe.custom_attributes || this.serverMediaImages.length == 0) {
        return;
      }
      clearTimeout(this.timeouts.initImages);
      let ctrl = this;
      this.timeouts.initImages = setTimeout(() => {
        ctrl.serverMediaImages.map(image => {
          var mockFile = { 
            name: image.label,
            entry : image,
            accepted: true,
            previewTemplate : document.createElement('div')
          };
          ctrl.imagesDropZone.emit("addedfile", mockFile);
          ctrl.imagesDropZone.emit("thumbnail", mockFile, image.file.resized);
          ctrl.imagesDropZone.emit('success', mockFile);
          ctrl.imagesDropZone.emit('complete', mockFile);
          ctrl.imagesDropZone.files.push(mockFile);
          ctrl.removeFileSizeElement(mockFile);
        });
      }, 2000);
    }

    removedImage(file) {
      if(file.entry && file.entry.id) {
        this.rest.deleteItem('', 'products/' + this.recipe.sku + '/media/' + file.entry.id).subscribe(
          res=>res,
          error => {
            this.imagesDropZone.emit('addedfile', file);
            this.imagesDropZone.emit('thumbnail', file, file.entry.file.resized);
            this.imagesDropZone.emit('success', file);
            this.imagesDropZone.emit('complete', file);
            this.imagesDropZone.files.push(file);
          }
        );
      } else if(file.addedIndex >= 0) {
        this.images = this.images.filter(image => image.addedIndex != file.addedIndex);
      }
    }

    addCustomArrtibute(attribute_code, value, required) {
      if(attribute_code == 'category_ids') {
        value = this._fb.array(value);
      }
      if(required) {
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
      let index = this.getCustomAttributeIndex(attribute_code);
      if(index >= 0) {
        let controls = this.recipeForm.controls['custom_attributes'].controls;
        return controls[index].get('value').value;
      }
      return '';
    }

    ingredientDisable() {
      return !(this.newIngredient.ingredient && this.newIngredient.qty);
    }

    refreshIngredientOptionValue(ingredient) {
      this.newIngredient.ingredient = ingredient;
    }

    addIngredient() {
      this.ingredients.push(this.newIngredient);
      this.newIngredient = {};
    }

    removeIngredient(i: number) {
      this.ingredients.splice(i, 1);
    }

    addRecipeStep() {
      this.recipeSteps.push(this.newRecipeStep);
      this.newRecipeStep = '';
    }

    removeRecipeStep(i: number) {
      this.recipeSteps.splice(i, 1);
    }

    addYouNeeds() {
      this.customerNeeds.push(this.newCustomerNeed);
      this.newCustomerNeed = '';
    }

    removeYouNeed(i: number) {
      this.customerNeeds.splice(i, 1);
    }

    addAllergy() {
      this.allergies.push(this.newAllerigy);
      this.newAllerigy = '';
    }

    removeAllergy(i: number) {
      this.allergies.splice(i, 1);
    }

    setInputErrorClass(input) {
      let invalid = this.recipeForm.get(input).invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
      let invalid = this.recipeForm.get(input).invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    setAttrInputErrorClass(attribute_code) {
      let index = this.getCustomAttributeIndex(attribute_code);
      let invalid = false;
      if(index >= 0) {
        invalid = this.recipeForm.controls['custom_attributes'].controls[index].invalid && this.submitted;
      }
      if(invalid) return 'form-control-danger';
    }

    setAttrContainerErrorClass(attribute_code) {
        let index = this.getCustomAttributeIndex(attribute_code);
        let invalid = false;
        if(index >= 0) {
          invalid = this.recipeForm.controls['custom_attributes'].controls[index].invalid && this.submitted;
        }
        if(invalid) return 'has-danger';
    }

    noticeRecipeSaved = function() {
      this.updatingMessage = 'The Recipe has been saved successfully!';
      this.saveModalClose = true;
      this.abortModalClose = false;
      this.modalRef.hide();
    }

    saveRecipe() {
      this.alert.clear();
      this.submitted = true;
      if (this.recipeForm.valid) {
          let recipeSku = this.route.snapshot.params['sku'];

          let sendData = this.recipeForm.value;
          sendData.custom_attributes.push({
            attribute_code : 'ingredients',
            value : JSON.stringify(this.ingredients)
          });
          sendData.custom_attributes.push({
            attribute_code : 'steps',
            value : JSON.stringify(this.recipeSteps)
          });
          sendData.custom_attributes.push({
            attribute_code : 'customer_needs',
            value : JSON.stringify(this.customerNeeds)
          });
          sendData.custom_attributes.push({
            attribute_code : 'allergies',
            value : JSON.stringify(this.allergies)
          });

          let saveUrl = 'products';
          if(!recipeSku) {
            recipeSku = '';
            sendData.sku = GlobalVariable.getRandomInt(10000, 99999);
          } else {
            saveUrl += '/' + recipeSku;
          }

          this.updatingMessage = 'Uploading the Recipe information...';
          this.saveModalClose = false;
          this.abortModalClose = true;
          this.openSaveModal();
          this.saveRequests = [];
          this.saveRequests.push(this.rest.saveItem(recipeSku, {product : sendData}, saveUrl).subscribe(product => {
            if(this.images.length == 0 && !this.pdfDocument) {
              this.noticeRecipeSaved();
              return;
            }
            this.doPDFUpload(product);
            this.doImagesUpload(product);
          }));
      } else {
        this.alert.error('Please check the form to enter all required details');
      }
    }

    pdfImageUploadingMessage() {
      let message = '';
      if(this.pdfDocument) {
        message += 'Uploading the Recipe PDF document...';
      }
      if(this.images.length > 0) {
        message += 'Uploading the Recipe images... ';
      }
      this.updatingMessage = message;
    }

    doPDFUpload = function(product) {
      if(!this.pdfDocument) return;
      this.pdfImageUploadingMessage();
      let base64 = this.pdfDocument.data64.split('base64,');
      let pdfdata = {
        product_id: product.id,
        media_type: 'pdf',
        label: this.pdfDocument.name,
        file: this.pdfDocument.name,
        content: {
          base64_encoded_data: base64[1],
          type: this.pdfDocument.type,
          name: this.pdfDocument.name
        }
      };
      this.saveRequests.push(this.rest.saveItem('', {pdfdata : pdfdata}, 'freshboxrecipespdf').subscribe(pdf => {
        this.imagesDropZone.emit('success', this.pdfDocument);
        this.imagesDropZone.emit('complete', this.pdfDocument);
        this.removeFileSizeElement(this.pdfDocument);
        this.appendPDFDownloaLink(this.pdfDocument, pdf[3]);
        this.pdfDocument = null;
        if(this.images.length == 0 && !this.pdfDocument) {
          this.noticeRecipeSaved();
        }
      }));
    }

    doImagesUpload = function(product) {
      this.pdfImageUploadingMessage();
      let totalImages = this.images.length;
      this.images.map(image => {
          let base64 = image.dataURL.split('base64,');
          let image_upload = {
            media_type: 'image',
            label: image.name,
            position: 0,
            disabled: 0,
            types: ['image','small_image','thumbnail','swatch_image'],
            file: image.name,
            content: {
              base64_encoded_data: base64[1],
              type: image.type,
              name: image.name
            }
          };
          this.saveRequests.push(this.recipesService.saveProductImage(product.sku, image_upload).subscribe(imageId => {
            let i = this.images.indexOf(image);
            this.images.splice(i, 1);
            this.pdfImageUploadingMessage();
            if(this.images.length == 0 && !this.pdfDocument) {
              this.noticeRecipeSaved();
            }
            image.entry = {};
            image.entry.id = imageId;
            this.imagesDropZone.emit('success', image);
            this.imagesDropZone.emit('complete', image);
          }));
        });
    }

    openSaveModal() {
      const config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalRef = this.modalService.show(this.saveModal, config);
    }

    abortSave() {
      if(this.saveRequests && this.saveRequests.length > 0) {
        this.saveRequests.map(sub => sub ? sub.unsubscribe() : '');
      }
      this.modalRef.hide();
    }

    goToList() {
      this.router.navigate(['recipes']);
    }
}
