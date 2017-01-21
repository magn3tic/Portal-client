import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { ApiService, StoreHelper } from './index';
import { Store } from '../store';
import { Observable } from 'rxjs';

var _ = require('lodash');
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
  HUBSPOTPROXY: string = 'https://3af9c93a.ngrok.io/hubAPI';
  CONTACTSPROXY: string = 'https://3af9c93a.ngrok.io/hubContacts';
  hubspotAPIKey: string = CONFIG.hubspot.APIKEY;
  // hubContacts: string = CONFIG.hubspot.allContacts;
  hubContacts: string = 'contacts/v1/lists/all/contacts/all/';
  constructor(private apiService: ApiService, private storeHelper: StoreHelper, private store: Store, private http: Http) {}

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

  hubSpotAPICall(body: any, typeOfCall?: string, options?: any, log?: any) {
  //   if(log) {
  //     console.log('HubSpotAPI.service.ts hubSpotAPICall called with typeOfCall: ', typeOfCall);
  //   }
  //   console.log('body: ', body);
  //   let reqBody = body;
  //   let nonOptionsQuery = {
  //     endpoint: reqBody
  //   }

  //   let optionsQuery = {
  //     endpoint: reqBody,
  //     options
  //   }
  //   return this.apiService.post(`${this.HUBSPOTPROXY}`, body)
  //     .map(this.checkForError)
  //     .catch(err => Observable.throw(err))
  //     .map(this.getJson)
  // }
return this.http.get(this.CONTACTSPROXY)
.map(res => console.log('contacts proxy returned: ', JSON.parse(res['_body'])))
  // getCompanies() {
  //   return this.http.get();
  }

}