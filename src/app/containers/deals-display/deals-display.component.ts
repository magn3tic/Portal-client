import {Component, OnInit} from '@angular/core';
import { ApiService, StoreHelper, AuthService, ClientsService, HubSpotAPIService } from '../../services'
import { Store } from '../../store';
import * as _ from 'lodash';
declare var CONFIG: any;

@Component({
  selector: 'deals-display',
  styles: [require('./deals-display.component.css')],
  template: require('./deals-display.component.html')
})

export class DealsDisplay implements OnInit{

  constructor(private clientsService: ClientsService, private apiService: ApiService, private storeHelper: StoreHelper, private authService: AuthService, private store: Store, private hubspotAPIService: HubSpotAPIService) {}

  HUBAPI: string = CONFIG.hubspot.APIURL;
  // HUBDEALS: string = CONFIG.hubspot.endpoints.allContacts;
  HUBDEALS: string = 'https://2b574bf1.ngrok.io/hubDeals';
  deals: Array<Object> = [];
  ngOnInit() {
    console.log('deals.length at ng init: ', this.store.getState().deals.length);
    // Check store for deals before making api call
    if(this.store.getState().deals.length < 1) {
      this.getDeals();
    } else {
      this.getDealsFromStore();
    }
  }

  getDeals() {
    this.hubspotAPIService.hubSpotDealsCall(this.HUBDEALS)
    .subscribe(res => {
      this.storeHelper.update('deals', res)
      this.deals = this.store.getState().deals;
      console.log('this.deals: ', this.deals);
    });
  }

  getDeal(dealId) {
    this.hubspotAPIService.hubspotDealCall(dealId)
    .subscribe(res => {
      console.log('this.hubspotapiservice.hubspotdealcall() res: ', res);
    })
  }

  getDealsFromStore() {
    console.log('deals already in store. getting them from store: ');
    this.deals = this.store.getState().deals;
  }

  selectClient(deal) {
    console.log('selected deal', deal);
    this.storeHelper.update('activeDeal', deal);
  }
}
