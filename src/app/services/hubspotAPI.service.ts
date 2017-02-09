import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { ApiService, StoreHelper } from './index';
import { Store } from '../store';
import { Observable } from 'rxjs';

import * as _ from 'lodash';
declare var CONFIG;

@Injectable()
export class HubSpotAPIService {
  headers: Headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${window.localStorage.getItem('hubspot_token')}`
  });

  HUBAUTHAPI: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBAUTH}`;
  HUBSPOTPROXY: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBAPI}`;
  CONTACTSPROXY: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBCONTACTS}`;
  HUBDEALS: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBDEALS}`;
  HUBDEAL: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBDEAL}`;
  HUBCOMPANIES: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBCOMPANIES}`;

  constructor(
    private apiService: ApiService, 
    private storeHelper: StoreHelper, 
    private store: Store, 
    private http: Http
  ) { }

  private getJson(response: Response) {
    return response.json();
  }

  private checkForError(response: Response): Response {
    console.log('checkForError');
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText);
      error['response'] = response;
      console.error(error);
      throw error;

    }
  }

  hubSpotAPICall(body: any, options?: Object) {

    if (options) {

    }

    return this.http.post(this.CONTACTSPROXY, this.headers)
      .map(res => JSON.parse(res['_body']))
      .map((rawContactsObj) => {
        let tempObj = { contacts: [] };
        _.forEach(rawContactsObj, (val) => {
          tempObj['contacts'].push(val.contacts)
        })
        return tempObj;
      })
      .map((contactsObj) => _.flatten(contactsObj.contacts))
  }

  hubSpotDealsCall(body: any, options?: Object) {

    if (options) {

    }

    return this.http.post(this.HUBDEALS, this.headers)
      .map(res => JSON.parse(res['_body']))
      .map((rawDealsObj) => {
        console.log('rawDealsObj: ', rawDealsObj);
        return rawDealsObj[0];
      })
      .map((dealsObj) => _.flatten(dealsObj.deals))
  }


  hubspotDealCall(body: any, options?: Object) {
    return this.http.post(this.HUBDEAL + '/' + body, this.headers)
      .map(res => JSON.parse(res['_body']))
  }

  hubSpotCompaniesCall(body: any, options?: Object) {

    if (options) {

    }

    return this.http.post(this.HUBCOMPANIES, this.headers)
      .map(res => JSON.parse(res['_body']))
      .map((companiesData) => {
        let tempCompaniesArr = [];
        const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
        _.forEach(companiesData, (val, key) => {
          tempCompaniesArr.push(val.companies)
        })
        tempCompaniesArr = flatten(tempCompaniesArr);
        return companiesData;
      })
  }
}