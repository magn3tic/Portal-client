import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
var _ = require('lodash');

@Pipe({name: 'quantityParse'})

export class QuantityParsePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: string) {
    // console.log('in html parse pipe, html is: ', html);
    let subItem = _.replace(
      html, 
      '%%quantity%%',
      '<input style="width: 50px;" type="number" placeholder="Quantity">' 
      );
    return subItem;
  }
}