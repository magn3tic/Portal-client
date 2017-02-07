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

  companiesAPI: string = CONFIG.hubspot.endpoints.getCompanies;
  magHttpsProxy: string = CONFIG.magneticProxy;
  // hubspotAPI: string = CONFIG.hubspot.APIURL
  hubspotAPI: string = 'https://api.hubapi.com/';
  HUBSPOTPROXY: string = 'https://b2c78a56.ngrok.io/hubAPI';
  CONTACTSPROXY: string = 'https://b2c78a56.ngrok.io/hubContacts';
  HUBDEALS: string = 'https://b2c78a56.ngrok.io/hubDeals';
  HUBDEAL: string = 'https://b2c78a56.ngrok.io/hubDeal';
  HUBCOMPANIES: string = 'https://b2c78a56.ngrok.io/hubCompanies';
  hubspotAPIKey: string = CONFIG.hubspot.APIKEY;
  // hubContacts: string = CONFIG.hubspot.allContacts;
  hubContacts: string = 'contacts/v1/lists/all/contacts/all/';
  constructor(private apiService: ApiService, private storeHelper: StoreHelper, private store: Store, private http: Http) { }

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
    // .map((rawDealsObj) => {
    //   console.log('rawDealsObj: ', rawDealsObj);
    //   return rawDealsObj[0];
    // })
    // .map((dealsObj) => _.flatten(dealsObj.deals))
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
        // console.log('tempCompaniesArr: ', tempCompaniesArr);
        // this.storeHelper.update('companies', tempCompaniesArr);
        return companiesData;
      })
  }
}