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
    this.clients = this.store.getState()['clients'];
    this.sub = this.route.params.subscribe(params => {
       this.id = params['_id']; // (+) converts string 'id' to a number
        this.findClient(this.id);
    });
  }

  findClient(clientID) {
    let self = this;
  //get client through route params
  this.client = (_.find(this.clients, {_id: clientID})) ? 
  _.find(this.clients, {_id: clientID}) : self.router.navigate(['clients'])
  .then(()=> {
    swal(
      'No Client Data',
      "Returning to clients view",
      'error'
    )
  })
  }

  goBack(): void {
      this.location.back();
    }
}
