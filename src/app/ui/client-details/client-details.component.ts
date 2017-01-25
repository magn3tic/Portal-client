import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { ApiService, StoreHelper, AuthService } from '../../services'
import { Store } from '../../store';
declare var CONFIG: any;
var _ = require('lodash');
declare var swal;

@Component({
  selector: 'client-details',
  styles: [require('./client-details.component.css')],
  template: require('./client-details.component.html')
})
export class ClientDetails implements OnInit{

  constructor(private location: Location, private router: Router, private route: ActivatedRoute, private apiService: ApiService, private storeHelper: StoreHelper, private authService: AuthService, private store: Store) {}
  id: number;
  private sub: any;
  clients: Array<any>;
  client: Object;
  
  ngOnInit() {
    this.client = this.store.getState()['activeClient'];
    console.log('active client: ', this.client);
  }

  // findClient(companyID) {
  //   let self = this;
  // //get client through route params
  // this.client = (companyID) ? _.find(this.clients[0], {companyId: parseInt(companyID)}) : self.router.navigate(['clients'])
  // console.log('this.client: ', this.client);
  // }

  goBack(): void {
      this.location.back();
    }
}
