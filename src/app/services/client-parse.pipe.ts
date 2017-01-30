import { Pipe, PipeTransform } from '@angular/core';
import {StoreHelper} from '../services';
import {Store} from '../store';
import {DomSanitizer} from '@angular/platform-browser';
var _ = require('lodash');

declare var swal;
@Pipe({name: 'clientParse'})

export class ClientParsePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer, private storeHelper: StoreHelper, private store: Store) {}
  company: Object;
  transform(html: string) {
    this.company = (this.store.getState()['activeCompany']) ? this.store.getState()['activeCompany'] : swal('No company!', 'omg', 'error');
    console.log('in html parse pipe, company is: ', this.company); 
    let subItem = _.replace(
      html, 
      "%%client%%",
      `${this.company['properties']['name']['value']}`
      );
    return this.sanitizer.bypassSecurityTrustHtml(subItem);
  }
}