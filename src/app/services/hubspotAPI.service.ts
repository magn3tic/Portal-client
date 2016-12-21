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
        Accept: 'application/json'
    });
  
  companiesAPI: string = CONFIG.hubspot.endpoints.getCompanies;
  magHttpsProxy: string = CONFIG.magneticProxy;
  hubspotAPIEndpoint: string = CONFIG.hubspot.APIURL
  hubspotAPIKey: string = CONFIG.hubspot.APIKEY;
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
    if(log) {
      console.log('HubSpotAPI.service.ts hubSpotAPICall called with typeOfCall: ', typeOfCall);
    }
    let reqBody = body;
    let nonOptionsQuery = {
      endpoint: reqBody
    }
    let reqOptions = options;
    let optionsQuery = {
      endpoint: reqBody,
      options: reqOptions
    }
    return this.http.post(`${this.magHttpsProxy}`, (reqOptions && reqOptions.length > 0) ? JSON.stringify(optionsQuery) : JSON.stringify(nonOptionsQuery), { headers: this.headers })
      .map(this.checkForError)
      .catch(err => Observable.throw(err))
      .map(this.getJson)
  }

  getCompanies() {
    return this.http.get(this.magHttpsProxy);
  }

}