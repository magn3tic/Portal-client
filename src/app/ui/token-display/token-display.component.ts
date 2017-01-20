import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  JWTREFRESH: string = 'refresh_token';
  // HUBTOKENURL: string = CONFIG.hubspot.HUBTOKENURL;
  HUBTOKENURL: string = 'https://3af9c93a.ngrok.io/hubToken';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
      .subscribe(res => {
        let resBody = JSON.parse(res._body);
        console.log('get token res: ', resBody);
        // console.log('res tokens: ', JSON.parse(res._body));
        this.storeHelper.update('user', { tokens: resBody });
        this.authService.setJwt(resBody.accessToken, this.JWTKEY)
          .then(localTokens => {
            this.authService.setJwt(resBody.refreshToken, this.JWTREFRESH).then(()=> {
              this.router.navigate(['/home']);
            })
            // .then(jwt=> console.log('jwt: ', jwt))
            .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      })

    // .map(token => this.storeHelper.add('user-acccess-jwt', token['accessToken']))
    // .do(token => this.storeHelper.add('user-refresh-jwt', token['refreshToken']));
    // .map(token => this.storeHelper.update('user-refresh-jwt', token.refreshToken));
  }

};
