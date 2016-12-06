import { Pipe, PipeTransform } from '@angular/core';
import {StoreHelper} from '../services';
import {Store} from '../store';
import {DomSanitizer} from '@angular/platform-browser';
var _ = require('lodash');

@Pipe({name: 'clientParse'})

export class ClientParsePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer, private storeHelper: StoreHelper, private store: Store) {}
  client: Object;
  transform(html: string) {
    this.client = this.store.getState()['activeClient'];
    // console.log('in html parse pipe, html is: ', html);
    let subItem = _.replace(
      html, 
      "%%client%%",
      `${this.client['name']}` 
      );
    return this.sanitizer.bypassSecurityTrustHtml(subItem);
  }
}