import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services';
import { AuthService } from '../../services';
import { StoreHelper } from '../../services';
import { Store } from '../../store';
import * as _ from 'lodash';

declare var CONFIG: any;
declare var swal: any;

@Component({
  selector: 'token-display',
  styles: [require('./token-display.component.css')],
  template: require('./token-display.component.html')
})
export class TokenDisplay implements OnInit {


  // JWTKEY: string = CONFIG.hubspot.JWTKEY;
  JWTKEY: string = 'hubspot_token';
  JWTREFRESH: string = 'refresh_token';
  EXPRESSPROXYCONTACT: string = 'https://57341804.ngrok.io/contact';
  // HUBTOKENURL: string = CONFIG.hubspot.HUBTOKENURL;
  HUBTOKENURL: string = 'https://57341804.ngrok.io/hubToken';
  userEmail: string = '';
  headers: Headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + window.localStorage.getItem(this.JWTKEY)
  });
  busy: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private http: Http,
    private storeHelper: StoreHelper,
    private store: Store
  ) {/** constructor body **/
  }

  ngOnInit() {
    this.getToken()
  }

  getToken() {
    return this.apiService.get(this.HUBTOKENURL)
      .subscribe(res => {
        let resBody = JSON.parse(res._body);
        console.log('get token res: ', resBody);
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
    let self = this;
    console.log('hubspotUserObject: ', hubspotUserObject);
    this.busy = this.apiService.post(this.EXPRESSPROXYCONTACT, { email: hubspotUserObject['user'], authorization: 'Bearer ' + window.localStorage.getItem(this.JWTKEY) })
      .subscribe(hubspotUserContactInfo => {
        console.log('apiService hubspotUserContactInfo: ', hubspotUserContactInfo)
        if (hubspotUserContactInfo.status === 'error') {
          swal({
            title: 'Authentication Credentials Expired',
            text: 'Please login again to refresh credentials',
            timer: 2000
          }).then(
            ()=> {},
            // handling the promise rejection
            (dismiss) => {
              if (dismiss === 'timer') {
                // console.log('I was closed by the timer')
                self.authService.signout();
                self.router.navigate(['auth']);
              }
            }
            )
        }
        this.storeHelper.update('user', { data: hubspotUserObject, contactInfo: hubspotUserContactInfo, loggedIn: true })
        this.router.navigate(['profile']);
      });
  }

};
