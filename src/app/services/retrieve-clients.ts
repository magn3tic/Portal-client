import { ApiService, StoreHelper } from './index';
import { Store } from '../store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var CONFIG; 

@Injectable()
export class RetrieveClients {
  clientsAPI: string = CONFIG.endpoints.clientsAPI;
  constructor(private apiService: ApiService, private storeHelper: StoreHelper, private store: Store) {}
  
  fetchClients() {
    return this.apiService.get(this.clientsAPI);
  }

}