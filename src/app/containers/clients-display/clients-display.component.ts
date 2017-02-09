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

  HUBAPI: string = `${CONFIG.HUBSPOTPROXY.APIURL}`;
  HUBCONTACTS: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBCONTACTS}`;
  clients: Array<Object> = [];
  stringFilter: Object = '';
  ngOnInit() {
    console.log('clients.length at ng init: ', this.store.getState().clients.length);
    // Check store for clients before making api call
    if(this.store.getState().clients.length < 1) {
      this.getClients();
    } else {
      this.getClientsFromStore();
    }
  }

  getClients() {
    this.hubspotAPIService.hubSpotAPICall(this.HUBCONTACTS)
    .subscribe(res => {
      this.storeHelper.update('clients', res)
      this.clients = this.store.getState().clients;
      console.log('this.clients: ', this.clients);
    });
  }

  getClientsFromStore() {
    console.log('clients already in store. getting them from store: ');
    this.clients = this.store.getState().clients;
  }

  selectClient(client) {
    console.log('selected client', client);
    this.storeHelper.update('activeClient', client);
  }
}
