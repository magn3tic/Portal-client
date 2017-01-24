import {Component, OnInit} from '@angular/core';
import { ApiService, StoreHelper, AuthService, ClientsService, HubSpotAPIService } from '../../services'
import { Store } from '../../store';
import * as _ from 'lodash';
declare var CONFIG: any;

@Component({
  selector: 'clients-display',
  styles: [require('./clients-display.component.css')],
  template: require('./clients-display.component.html')
})

export class ClientsDisplay implements OnInit{

  constructor(private clientsService: ClientsService, private apiService: ApiService, private storeHelper: StoreHelper, private authService: AuthService, private store: Store, private hubspotAPIService: HubSpotAPIService) {}

  HUBAPI: string = CONFIG.hubspot.APIURL;
  HUBCONTACTS: string = CONFIG.hubspot.endpoints.allContacts;
  clients: Array<Object> = [];
  ngOnInit() {
    this.getClients();
  }

  getClients() {
    this.hubspotAPIService.hubSpotAPICall(this.HUBCONTACTS)
    .subscribe(res => {
      this.storeHelper.update('clients', res)
      this.clients = this.store.getState().clients;
      console.log('this.clients: ', this.clients);
    });
  }
}
