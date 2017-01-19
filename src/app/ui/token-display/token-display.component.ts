import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services';
import { AuthService } from '../../services';
import { StoreHelper } from '../../services';
import * as _ from 'lodash';

declare var CONFIG: any;

@Component({
  selector: 'token-display',
  styles: [require('./token-display.component.css')],
  template: require('./token-display.component.html')
})
export class TokenDisplay implements OnInit {
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
  ) {/** constructor body **/ }

  ngOnInit() {
    // Get and set JWT on init
    console.log('ngOnInit running JWTKEY: ', this.JWTKEY, ' HUBTOKENURL: ', this.HUBTOKENURL);
    this.getToken();
  }

  getToken() {
    this.apiService.get(this.HUBTOKENURL)
      .subscribe(token => {
        this.authService.setJwt(token.accessToken, this.JWTKEY)
          .then(localToken => {
            // Will want to loop through the localstorage tokens
            // _.forEach(localTokens, (token) => {
            //   console.log('local tokens: ', token);
            // })
            this.storeHelper.update('user', {accessToken: localToken});

          })
          .catch(err => console.error(err))
      })

    // .map(token => this.storeHelper.add('user-acccess-jwt', token['accessToken']))
    // .do(token => this.storeHelper.add('user-refresh-jwt', token['refreshToken']));
    // .map(token => this.storeHelper.update('user-refresh-jwt', token.refreshToken));
  }

};
