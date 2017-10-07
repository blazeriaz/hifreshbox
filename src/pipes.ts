import { Pipe, PipeTransform } from '@angular/core';
import * as GlobalVariable from "./global";

@Pipe({name: 'mgCatalogAttribute'})
export class mgCatalogAttribute implements PipeTransform {
  transform(productAtts: Array<any>, attribute_code: string): any {
    if (!productAtts) return productAtts;

    let attr = productAtts.find(x => x.attribute_code === attribute_code);

    let attr_vlue = (attr)?attr.value:'';

    if(attribute_code == 'image' || attribute_code == 'small_image' || attribute_code == 'thumbnail') {
        attr_vlue = GlobalVariable.BASE_MEDIA_URL + attr_vlue;
    }

    return attr_vlue;
  }
}

@Pipe({name: 'mgCatalogImage'})
export class mgCatalogImage implements PipeTransform {
  transform(imgSrc: string): any {
    return GlobalVariable.BASE_MEDIA_URL + imgSrc;
  }
}

@Pipe({name: 'jsonParse'})
export class jsonParse implements PipeTransform {
  transform(jsonString: string): any {
    if (!jsonString) {
      return null;
    }
    return JSON.parse(jsonString);
  }
}

@Pipe({name: 'zeropad'})
export class zeropad implements PipeTransform {
  transform(number: string, length: number): any {
    let s = number + ''; const c = '0';
    while (s.length < length) {
      s = c + '' + s;
    }
    return s;
  }
}