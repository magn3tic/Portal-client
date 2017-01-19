import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services';

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
    private http: Http
    ) {
      console.log('JWTKEY: ', this.JWTKEY, ' HUBTOKENURL: ', this.HUBTOKENURL );
    }

  ngOnInit() {
    // Get and set JWT on init
    this.getToken();
  }

  setJwt(jwt: string) {
        window.localStorage.setItem(this.JWTKEY, jwt);
        this.apiService.setHeaders({ Authorization: `Bearer ${jwt}` });
    }

  getToken() {
    this.apiService.get(this.HUBTOKENURL)
    .do(token => this.setJwt(token));
  }

};
