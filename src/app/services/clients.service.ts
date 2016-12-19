import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { CanActivate, Router } from '@angular/router';
import { HubSpotAPIService } from './hubspotAPI.service';
import { StoreHelper } from './index';
import { Store } from '../store';
import { Observable } from 'rxjs';

declare var swal: any;
var _ = require('lodash');
declare var CONFIG;

@Injectable()
export class ClientsService /*implements CanActivate*/ {
  hubspotGetCompanyURL: string = CONFIG.hubspot.endpoints.getCompany;
  clientsAPI: string = CONFIG.endpoints.clientsAPI;
  magHttpsProxy: string = CONFIG.magneticProxy;
  hubspotAPIEndpoint: string = CONFIG.hubspot.APIURL
  hubspotAPIKey: string = CONFIG.hubspot.APIKEY;
  tempCompanyArr: Array<any> = [];
  constructor(private hubspotAPIService: HubSpotAPIService, private store: Store, private storeHelper: StoreHelper, private router: Router) { }

  canActivate(): boolean {
    const fetchingComplete = (this.store.getState().clients.length >= 1) ? true : false;
    console.log('canActivate: ', fetchingComplete);
    if (!fetchingComplete) {
      swal({
        title: 'Loading Client Data',
        text: "Please wait for it",
        type: 'error',
        confirmButtonText: 'OK',
        html: `
          <h2>Basic Progress Bar</h2>
          <div class="progress">
            <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:90%">
              <span class="sr-only">90% Complete</span>
            </div>
          </div>
        `
      }).then(() => {
          swal({
            title: 'Returning to Home',
            text: 'Try returning later',
            type: 'warning',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['']);
          }) 
        })
    }
    return fetchingComplete;
  }

  fetchCompanies() {
    const self = this;
    self.hubspotAPIService.getCompanies()
      .map(res => res.json())
      .subscribe(clients => {
        console.log('clients: ', clients)
        _.forEach(clients, client => self.tempCompanyArr.push(client))
      });
    return self.storeHelper.add('clients', self.tempCompanyArr);
  }

}