import {Component, OnInit} from '@angular/core';
import { ApiService, StoreHelper, AuthService, ClientsService, HubSpotAPIService } from '../../services'
import { Store } from '../../store';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
declare var CONFIG: any;

@Component({
  selector: 'companies-display',
  styles: [require('./companies-display.component.css')],
  template: require('./companies-display.component.html')
})

export class CompaniesDisplay implements OnInit{

  constructor(private clientsService: ClientsService, private apiService: ApiService, private storeHelper: StoreHelper, private authService: AuthService, private store: Store, private hubspotAPIService: HubSpotAPIService) {}

  HUBAPI: string = `${CONFIG.HUBSPOTPROXY.APIURL}`;
  HUBCOMPANIES: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBCOMPANIES}`;
  companies: Array<Object> = [];

  // Busy spinner docs: https://www.npmjs.com/package/angular2-busy
  busy: Subscription;

  ngOnInit() {
    // console.log('companies.length at ng init: ', this.store.getState().companies.length);
    // Check store for companies before making api call
    if(this.store.getState().companies.length < 1) {
      this.getCompanies();
    }
    this.companies = this.store.getState().companies;
  }

  getCompanies() {
    this.busy = this.hubspotAPIService.hubSpotCompaniesCall(this.HUBCOMPANIES)
    .subscribe(res => {
      this.storeHelper.update('companies', res)
      this.companies = this.store.getState().companies;
      // console.log('this.companies: ', this.companies);
    });
  }

  getDeal(dealId) {
    this.hubspotAPIService.hubspotDealCall(dealId)
    .subscribe(res => {
      console.log('this.hubspotapiservice.hubspotdealcall() res: ', res);
    })
  }

  getCompaniesFromStore() {
    console.log('companies already in store. getting them from store: ');
    this.companies = this.store.getState().companies;
  }

  selectCompany(company) {
    console.log('selected company', company);
    this.storeHelper.update('activeCompany', company);
  }
}
