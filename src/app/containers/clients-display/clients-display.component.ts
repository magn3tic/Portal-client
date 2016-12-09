import {Component, OnInit} from '@angular/core';
import { ApiService, StoreHelper, AuthService, ClientsService } from '../../services'
import { Store } from '../../store';
declare var CONFIG: any;
var _ = require('lodash');

@Component({
  selector: 'clients-display',
  styles: [require('./clients-display.component.css')],
  template: require('./clients-display.component.html')
})
export class ClientsDisplay implements OnInit{

  constructor(private clientsService: ClientsService, private apiService: ApiService, private storeHelper: StoreHelper, private authService: AuthService, private store: Store) {

  }
  clientsAPI: string = CONFIG.endpoints.clientsAPI;
  clients;
  input:any;
  
  ngOnInit() {
    this.getClients();
  }

  getClients() {
    this.clientsService.fetchClients()
    .subscribe((res)=> {
      this.clients = this.store.getState()['clients'];
    });
    // console.log('in clients display this.clients: ', this.clients);
  }
}
