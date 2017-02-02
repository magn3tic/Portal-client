import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services';
import { AuthService } from '../../services';
import { StoreHelper } from '../../services';
import { Store } from '../../store';
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
  JWTREFRESH: string = 'refresh_token';
  EXPRESSPROXYCONTACT: string = 'https://c1aabba0.ngrok.io/contact';
  // HUBTOKENURL: string = CONFIG.hubspot.HUBTOKENURL;
  HUBTOKENURL: string = 'https://c1aabba0.ngrok.io/hubToken';
  userEmail: string = '';
  headers: Headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + window.localStorage.getItem(this.JWTKEY)
  });
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private http: Http,
    private storeHelper: StoreHelper,
    private store: Store
  ) {/** constructor body **/ }

  ngOnInit() {
    // Get and set JWT on init
    // console.log('ngInit user in state: ', this.store.getState().user);
    // if(this.authService.isAuthorized()) {

    // }

    this.getToken()
  }

  getToken() {
      this.apiService.get(this.HUBTOKENURL)
        .subscribe(res => {
          let resBody = JSON.parse(res._body);
          // console.log('get token res: ', resBody);
          // console.log('res tokens: ', JSON.parse(res._body));
          this.authService.setJwt(resBody.accessToken)
          this.setUser(resBody.accessToken);
        })
  }

  setUser(token) {
    this.authService.getUser(token)
      .subscribe(user => {
        let hubspotUserObject = JSON.parse(user);
        this.getUserHubspotContact(hubspotUserObject);
      })
  }

  getUserHubspotContact(hubspotUserObject) {
    console.log('hubspotUserObject: ', hubspotUserObject);
    this.apiService.post(this.EXPRESSPROXYCONTACT, { email: hubspotUserObject['user'], authorization: 'Bearer ' + window.localStorage.getItem(this.JWTKEY) })
      .subscribe(hubspotUserContactInfo => {
        console.log('apiService hubspotUserContactInfo: ', hubspotUserContactInfo)
        this.storeHelper.update('user', { data: hubspotUserObject, contactInfo: hubspotUserContactInfo, loggedIn: true })
        this.router.navigate(['profile']);
      });
  }

};
