import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HubSpotAPIService } from './hubspotAPI.service';
import { StoreHelper } from './index';
import { Store } from '../store';
import { Observable } from 'rxjs';

var _ = require('lodash');
declare var CONFIG; 

@Injectable()
export class ClientsService {
  hubspotGetCompanyURL: string = CONFIG.hubspot.endpoints.getCompany;
  clientsAPI: string = CONFIG.endpoints.clientsAPI;
  magHttpsProxy: string = CONFIG.magneticProxy;
  hubspotAPIEndpoint: string = CONFIG.hubspot.APIURL
  hubspotAPIKey: string = CONFIG.hubspot.APIKEY;
  tempCompanyArr: Array<any> = [];
  constructor(private hubspotAPIService: HubSpotAPIService, private store: Store, private storeHelper: StoreHelper) {}

  fetchDeals(body: any, typeOfCall?: string, options?: any) {
    console.log('clients.service.ts fetchDeals called with typeOfCall: ', typeOfCall);
    let reqBody = body;
    let reqOptions = options;
    let data = {
      endpoint: reqBody,
      options: reqOptions
    }
    return this.hubspotAPIService.hubSpotAPICall(reqBody, typeOfCall, reqOptions);
  }

  fetchCompanies(companyIds: Array<any>) {
    const self = this;
    _.forEach(companyIds, (id) => {
      // console.log('in fetchCompanies companyIds id: ', id)
      self.fetchCompany(id);
    });
    return self.storeHelper.add('clients', self.tempCompanyArr);
  }

  fetchCompany(id: number) {
    const self = this;
    console.log('fetchCompany called, id: '+ id);
    let query = (id) ? _.replace(self.hubspotGetCompanyURL, ':companyId', id) : null;
    // console.log('getCompanyurl: ', query);
    // console.log('query: ', query);
    self.hubspotAPIService.hubSpotAPICall(query, 'getCompany')
    .subscribe((res) => {
      self.tempCompanyArr.push(res.data);
      // console.log('fetchCompany res: ', res.data)
    });
  }

}