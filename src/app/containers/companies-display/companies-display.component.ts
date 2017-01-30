import {Component, OnInit} from '@angular/core';
import { ApiService, StoreHelper, AuthService, ClientsService, HubSpotAPIService } from '../../services'
import { Store } from '../../store';
import * as _ from 'lodash';
declare var CONFIG: any;

@Component({
  selector: 'companies-display',
  styles: [require('./companies-display.component.css')],
  template: require('./companies-display.component.html')
})

export class CompaniesDisplay implements OnInit{

  constructor(private clientsService: ClientsService, private apiService: ApiService, private storeHelper: StoreHelper, private authService: AuthService, private store: Store, private hubspotAPIService: HubSpotAPIService) {}

  HUBAPI: string = CONFIG.hubspot.APIURL;
  // HUBDEALS: string = CONFIG.hubspot.endpoints.allContacts;
  HUBCOMPANIES: string = 'https://c1aabba0.ngrok.io/hubCompanies';
  companies: Array<Object> = [];
  ngOnInit() {
    // console.log('companies.length at ng init: ', this.store.getState().companies.length);
    // Check store for companies before making api call
    if(this.store.getState().companies.length < 1) {
      this.getCompanies();
    }
    this.companies = this.store.getState().companies;
  }

  getCompanies() {
    this.hubspotAPIService.hubSpotCompaniesCall(this.HUBCOMPANIES)
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
