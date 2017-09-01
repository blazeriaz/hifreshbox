import { Component, OnInit, Injectable, TemplateRef, ViewChild } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as GlobalVariable from "../../global";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Injectable()
export class recipeEditResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    let recipeSku = route.params['sku'];
    return this.rest.getItem('', 'products/' + recipeSku);
  }
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Component({
    templateUrl: 'form.component.html'
})
export class RecipeFormComponent implements OnInit {
  @ViewChild('savemodal') saveModal: TemplateRef<any>;
    private recipe:any;
    private recipeForm:any;
    private customAttributes:any;
    private ingredientsOptions:any;
    private ingredients:any;
    private newIngredient:any;
    private recipeSteps:any;
    private newRecipeStep:any;
    private youNeeds:any;
    private newYouNeed:any;
    private allergies:any;
    private newAllerigy:any;
    private submitted:any;
    
    images;
    imageUploadConfig: DropzoneConfigInterface;
    serverImagesLoading;    
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

    constructor(
      private recipesService: ProductsService,
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder,
      private modalService: BsModalService
    ) {
      this.rest.setRestModule('products');
    }
    
    ngOnInit(): void {
      this.ingredients = [];
      this.newIngredient = {};
      this.recipeSteps = [];
      this.youNeeds = [];
      this.allergies = [];
      this.ingredientsOptions = null;
      this.images = [];

      this.recipesService.getIngredienOptions().subscribe(data => {
        this.ingredientsOptions = {};
        let options = data[0];
        this.ingredientsOptions.ingredients = options.ingredients.map(ingredient => {
          return {id: ingredient.ingredient_id, text: ingredient.title}
        });
        this.ingredientsOptions.portions = options.portions.map(portion => {
          return {id: portion.portion_id, text: portion.title}
        });
      });;

      let recipeSku = this.route.snapshot.params['sku'];
      this.recipe = (recipeSku)?this.route.snapshot.data['recipe']:{};

      this.imageUploadConfig = {
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
            ctrl.loadMediaImages(this);
          }
        })(this)
      };

      this.pdfUploadConfig = {
        acceptedFiles: 'application/pdf',
        addRemoveLinks: false,
        accept : (function(ctrl){
          return function(pdf) {
            let reader = new FileReader();
            reader.onload = handleReaderLoad;
            reader.readAsDataURL(pdf);
            function handleReaderLoad(evt) {
              pdf.data64 = evt.target.result;
            }
            
            this.files.map(file => {
              if(pdf != file) {
                this.removeFile(file);
              }
            });
            this.emit('thumbnail', pdf, GlobalVariable.pdfDataURL)
            ctrl.pdfDocument = pdf;
          }
        })(this),
        init : (function(ctrl){
          return function() {
            ctrl.loadPdfDocuments(this);
          }
        })(this)
      };

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

      ["ingredients", "steps"].map(attribute_code => {
        let value:any = [];
        if(this.recipe && this.recipe.custom_attributes) {
          let attribute = this.recipe.custom_attributes.find(x => x.attribute_code == attribute_code);
          value = attribute.value;
        };
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = [];
        }
        if(attribute_code == "ingredients") {
          this.ingredients = value;
        }
        if(attribute_code == "steps") {
          this.recipeSteps = value;
        }
      });
      customAttributesArray.push(this.addCustomArrtibute("category_ids", ['41'], false));
      
      this.recipeForm = this._fb.group({
        name : [this.recipe.name, [Validators.required, Validators.minLength(5)]],
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

    loadPdfDocuments(pdfDropZone) {
      this.pdfDropZone = pdfDropZone;
      if(this.serverPDFLoading || !this.recipe || !this.recipe.sku) {
        return;
      }
    }

    loadMediaImages(imagesDropZone) {      
      this.imagesDropZone = imagesDropZone;
      if(this.serverImagesLoading || !this.recipe || !this.recipe.sku) {
        return;
      }
      this.serverImagesLoading = true;
      this.rest.getItem('', 'products-gal/'+this.recipe.sku+'/media').subscribe(function(images){
        images.map(function(image){
          var mockFile = { 
            name: image.label,
            entry : image,
            accepted: true 
          };
          imagesDropZone.emit("addedfile", mockFile);
          imagesDropZone.emit("thumbnail", mockFile, image.file.resized);
          imagesDropZone.emit("success", mockFile);
          imagesDropZone.emit("complete", mockFile);
          imagesDropZone.files.push(mockFile);
        });                  
      });
    }

    removedImage(file) {      
      if(file.entry && file.entry.id) {
        this.rest.deleteItem('', 'products/' + this.recipe.sku + '/media/' + file.entry.id).subscribe(
          res=>res,
          error => {
            this.imagesDropZone.emit("addedfile", file);
            this.imagesDropZone.emit("thumbnail", file, file.entry.file.resized);
            this.imagesDropZone.emit("success", file);
            this.imagesDropZone.emit("complete", file);
            this.imagesDropZone.files.push(file);
          }
        );
      } else if(file.addedIndex >= 0) {
        this.images = this.images.filter(image => image.addedIndex != file.addedIndex);
      }
    }

    addCustomArrtibute(attribute_code, value, required) {
      if(attribute_code == "category_ids") {
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
      this.newRecipeStep = "";
    }

    removeRecipeStep(i: number) {
      this.recipeSteps.splice(i, 1);
    }

    addYouNeeds() {
      this.youNeeds.push(this.newYouNeed);
      this.newYouNeed = "";
    }

    removeYouNeed(i: number) {
      this.youNeeds.splice(i, 1);
    }

    addAllergy() {
      this.allergies.push(this.newAllerigy);
      this.newAllerigy = "";
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

    saveRecipe() {
      this.alert.clear();
      this.submitted = true;
      if (this.recipeForm.valid) {
          let recipeSku = this.route.snapshot.params['sku'];
          
          let sendData = this.recipeForm.value;
          sendData.custom_attributes.push({
            attribute_code : "ingredients",
            value : JSON.stringify(this.ingredients)
          });
          sendData.custom_attributes.push({
            attribute_code : "steps",
            value : JSON.stringify(this.recipeSteps)
          });
          let saveUrl = "products"; 
          if(!recipeSku) {
            recipeSku = '';
            sendData.sku = getRandomInt(10000, 99999);
          } else {
            saveUrl += "/" + recipeSku;
          }

          this.updatingMessage = "Uploading the Recipe information...";
          this.saveModalClose = false;
          this.abortModalClose = true;
          this.openSaveModal();
          this.saveRequests = [];
          this.saveRequests.push(this.rest.saveItem(recipeSku, {product : sendData}, saveUrl).subscribe(data => {    
            if(this.images.length == 0) {
              this.updatingMessage = "The Recipe information saved successfully!"; 
              this.saveModalClose = true;
              this.abortModalClose = false;
              return;
            }
            this.updatingMessage = "Uploading the Recipe images...";   
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
              this.saveRequests.push(this.recipesService.saveProductImage(data.sku, image_upload).subscribe(data => {
                let i = this.images.indexOf(image);
                this.images.splice(i, 1);
                this.updatingMessage = "Uploading the Recipe images... " 
                      + (totalImages - this.images.length) + " / " + totalImages + " Images uploaded!";
                if(this.images.length == 0) {
                  this.updatingMessage = "The Recipe information and images saved successfully!"; 
                  this.saveModalClose = true;
                  this.abortModalClose = false;
                }
                image.entry = {};
                image.entry.id = data;
                this.imagesDropZone.emit("success", image);
                this.imagesDropZone.emit("complete", image);
              }));
            });
          }));
      } else {
        this.alert.error("Please check the form to enter all required details");
        
      }
    }
    
    openSaveModal() {
      let config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalRef = this.modalService.show(this.saveModal, config);
    }

    abortSave() {
      if(this.saveRequests && this.saveRequests.length > 0) {
        this.saveRequests.map(sub=>sub?sub.unsubscribe():'');
      }
      this.modalRef.hide();
    }

    goToList() {
      this.router.navigate(['recipes']);
    }
}
