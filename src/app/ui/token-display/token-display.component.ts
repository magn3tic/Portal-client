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
  JWTKEY: string = CONFIG.hubspot.JWTKEY;
  HUBTOKENURL: string = CONFIG.hubspot.HUBTOKENURL;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private http: Http
    ) {
      
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
