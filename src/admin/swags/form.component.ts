import { Component, OnInit, Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as GlobalVariable from "../../global";

@Injectable()
export class swagEditResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    let swagSku = route.params['sku'];
    this.rest.setRestModule('products');
    return this.rest.getItem(swagSku);
  }
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function checkAllChildrenValid (c: FormArray): { [key: string] : any} {
    if (c.controls.length == 0) {
        return {
            checkAllChildrenValid: true
        };
    }

    for (let i: number = 0; i < c.controls.length-1; i++) {
        if (!c.controls[i].valid) {
            return {
                checkAllChildrenValid: true
            };
        }
    }

    return {
        checkAllChildrenValid: false
    };
}

@Component({
    templateUrl: 'form.component.html',
    styles: ['.dz-progress{display:none;}']
})
export class SwagFormComponent implements OnInit {
    private swag:any;
    private swagForm:any;
    private customAttributes:any;
    private ingredientsOptions:any;
    private ingredients:any;
    private newIngredient:any;
    private swagSteps:any;
    private newSwagStep:any;
    private submitted:any;
    private images:any;
    imageUploadConfig: DropzoneConfigInterface;
    addImageIndex;
    constructor(
      private swagsService: ProductsService,
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder
    ) { }

    removedfile(file) {
      if(file.addedIndex >= 0) {
        this.images = this.images.filter(image => image.addedIndex != file.addedIndex);
      }
      console.log(this.images);
    }
    
    ngOnInit(): void {
      this.images = [];
      this.addImageIndex = 0;

      this.imageUploadConfig = {
        url: 'https://httpbin.org/post',
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        accept : (function(ctrl){
          return function(file) {        
            file.addedIndex = ctrl.addImageIndex;
            file.previewElement.classList.add('dz-success');
            file.previewElement.classList.add('dz-complete');
            ctrl.images.push(file);
            ctrl.addImageIndex++;
            console.log(ctrl.images);
          }
        })(this),
        init : (function(ctrl){
          return function() {
            (function(dropzone){
              if(ctrl.swag && ctrl.swag.sku) {
                ctrl.rest.getItem('', 'products/'+ctrl.swag.sku+'/media').subscribe(function(images){
                  images.map(function(image){
                    var mockFile = { 
                      name: image.label,
                      entry : image,
                      accepted: true 
                    };
                    alert(GlobalVariable.BASE_MEDIA_URL + image.file);
                    dropzone.emit("addedfile", mockFile);
                    dropzone.createThumbnailFromUrl(mockFile, GlobalVariable.BASE_MEDIA_URL + image.file);
                    dropzone.emit("success", mockFile);
                    dropzone.emit("complete", mockFile);
                    dropzone.files.push(mockFile);
                  });                  
                });
              }
            })(this);
            /**
            var mockFile = { name: fileName, size: fileSize, type: fileMimeType, serverID: 0, accepted: true };
            this.emit("addedfile", mockFile);
            this.createThumbnailFromUrl(mockFile, fileUrl);
            this.emit("success", mockFile);
            this.emit("complete", mockFile);
            this.files.push(mockFile);*/
          }
        })(this)
      };

      let swagSku = this.route.snapshot.params['sku'];
      this.swag = (swagSku)?this.route.snapshot.data['swag']:{};
      this.rest.setRestModule('products');

      this.customAttributes = [];
      let customAttributesArray = [];
      ["description", "order_shipping", "return_policy"].map(attribute_code => {
        let value = '';
        if(this.swag && this.swag.custom_attributes) {
          let attribute = this.swag.custom_attributes.find(x => x.attribute_code == attribute_code);
          value = attribute?attribute.value:'';
        };
        this.customAttributes.push(attribute_code);
        customAttributesArray.push(this.addCustomArrtibute(attribute_code, value, true));
      });
      customAttributesArray.push(this.addCustomArrtibute("category_ids", ['41'], false));
      
      this.swagForm = this._fb.group({
        name : [this.swag.name, [Validators.required, Validators.minLength(5)]],
        status : this.swag.status?this.swag.status:1,
        visibility: 1,
        type_id : 'simple',
        price : this.swag.price,
        attribute_set_id : 17,
        extension_attributes : this._fb.group({
          stock_item : this._fb.group({
            manage_stock : 1,
            is_in_stock : 1,
            qty : this.swag.extension_attributes?this.swag.extension_attributes.stock_item.qty:0
          })
        }),
        custom_attributes : this._fb.array(customAttributesArray)     
      });
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
        let controls = this.swagForm.controls['custom_attributes'].controls;
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
        if(this.getStatus() == type) {
            return 'btn-primary';
        } else {
            return 'btn-secondary';
        }
    }

    setInputErrorClass(input) {
      let invalid = this.swagForm.get(input).invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
      let invalid = this.swagForm.get(input).invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    setAttrInputErrorClass(attribute_code) {
      let index = this.getCustomAttributeIndex(attribute_code);
      let invalid = false;
      if(index >= 0) {
        invalid = this.swagForm.controls['custom_attributes'].controls[index].invalid && this.submitted;
      }
      if(invalid) return 'form-control-danger';
    }

    setAttrContainerErrorClass(attribute_code) {
        let index = this.getCustomAttributeIndex(attribute_code);
        let invalid = false;
        if(index >= 0) {
          invalid = this.swagForm.controls['custom_attributes'].controls[index].invalid && this.submitted;
        }
        if(invalid) return 'has-danger';
    }

    setQtyInputErrorClass() {
      let invalid = this.swagForm.controls['extension_attributes'].controls['stock_item'].controls['qty'].invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setQtyContainerErrorClass() {
      let invalid = this.swagForm.controls['extension_attributes'].controls['stock_item'].controls['qty'].invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    saveSwag() {
      this.alert.clear();
      this.submitted = true;
      if (this.swagForm.valid) {
          let swagSku = this.route.snapshot.params['sku'];
          
          let sendData = this.swagForm.value;
          if(!swagSku) {
            swagSku = '';
            sendData.sku = getRandomInt(10000, 99999);
          }

          this.rest.saveItem(swagSku, {product : sendData}).subscribe(
            data => {
              /**if(this.images) {
                let base64 = this.image.base64.split('base64,');
                let image_upload = {
                  media_type: 'image',
                  label: 'Product Image',
                  position: 0,
                  disabled: 0,
                  types: ['image','small_image','thumbnail','swatch_image'],
                  file: this.image.filename,
                  content: {
                    base64_encoded_data: base64[1],
                    type: this.image.filetype,
                    name: this.image.filename
                  }                    
                };
                this.rest.showLoader();
                this.swagsService.saveProductImage(data.sku, image_upload).subscribe(
                  data => {
                    this.rest.hideLoader();
                    this.alert.success("The swag details are saved successfully!", true);
                    this.router.navigate(['swags']);
                  }
                );
              } else {**/
                this.alert.success("The swag details are saved successfully!", true);
                this.router.navigate(['swags']);
             // }                   
            }, error => {
              if(error.status == 401) {
                  this.alert.error("Access restricted!");
              } else {
                  this.alert.error("Server Error");
              }
              window.scrollTo(0,0);
          }
        );
      } else {
        this.alert.error("Please check the form to enter all required details");
        window.scrollTo(0,0);
      }
    }

    goToList() {
      this.router.navigate(['swags']);
    }
}
