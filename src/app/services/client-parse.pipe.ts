import { Pipe, PipeTransform } from '@angular/core';
import {StoreHelper} from '../services';
import {Store} from '../store';
import {DomSanitizer} from '@angular/platform-browser';
var _ = require('lodash');

declare var swal;
@Pipe({name: 'clientParse'})

export class ClientParsePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer, private storeHelper: StoreHelper, private store: Store) {}
  client: Object;
  transform(html: string) {
    this.client = (this.store.getState()['activeClient']) ? this.store.getState()['activeClient'] : swal('No Client!', 'omg', 'error');
    console.log('in html parse pipe, client is: ', this.client); 
    let subItem = _.replace(
      html, 
      "%%client%%",
      `${this.client['properties']['company']['value']}`
      );
    return this.sanitizer.bypassSecurityTrustHtml(subItem);
  }
}