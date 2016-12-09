import { Injectable, Inject } from '@angular/core';
import { ClientsService } from './clients.service';
import { Store } from '../store';
var _ = require('lodash');

@Injectable()
export class MyClients {
  clients: Array<any> = [];
  myClients: any;
  constructor(private clientsService: ClientsService, private store: Store) {}

  getClients(user: String)  {
    let self = this;
    // this.retrieveClients.fetchClients().subscribe((res)=> {
    //   _.forEach(res.data, (val, key)=> {
    //     // _.reduce(self.clients, val);
    //     self.clients[key]=val;
    //     console.log(' self.clients: ', self.clients);
    //   })
    // });
    this.myClients = _.filter(this.store.getState().clients,  {data: {manager: {email: user}}});
    console.log('in MyClients service, this.myClients: ', this.myClients, ' user: ', user, ' this.clients: ', this.clients );
    return this.myClients;
  }  
}