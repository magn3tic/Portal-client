import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services';
import {AuthService} from '../../services';
import {StoreHelper} from '../../services';
import * as _ from 'lodash';

declare var CONFIG: any;

@Component({
  selector: 'token-display',
  styles: [require('./token-display.component.css')],
  template: require('./token-display.component.html')
})
export class TokenDisplay implements OnInit{
  // JWTKEY: string = CONFIG.hubspot.JWTKEY;
  JWTKEY: string = 'hubspot_token';
  // HUBTOKENURL: string = CONFIG.hubspot.HUBTOKENURL;
  HUBTOKENURL: string = 'https://3af9c93a.ngrok.io/hubToken';
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private http: Http,
    private storeHelper: StoreHelper
    ) {
      console.log('JWTKEY: ', this.JWTKEY, ' HUBTOKENURL: ', this.HUBTOKENURL );
    }

  ngOnInit() {
    // Get and set JWT on init
    this.getToken();
  }

  getToken() {
    this.apiService.get(this.HUBTOKENURL)
    .map(token => this.authService.setJwt(token.accessToken));
    // .map(token => this.storeHelper.add('user-acccess-jwt', token['accessToken']))
    // .map(token => this.storeHelper.add('user-refresh-jwt', token['refreshToken']));
    // .map(token => this.storeHelper.update('user-refresh-jwt', token.refreshToken));
  }

};
