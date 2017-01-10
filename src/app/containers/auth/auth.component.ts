import { Component } from '@angular/core';
import {AuthService} from '../../services';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'auth-container',
  styles: [`
    a:hover {
        cursor: pointer;
      }
  `],
  template: require('./auth.component.html')
})

export class Auth {
  hubAuthAPI: string = 'https://app.hubspot.com/oauth/authorize?client_id=4341ae1b-abed-4c31-99b5-712a2c1f4b38&scope=contacts%20automation&redirect_uri=https://magn3tic.github.io/Portal-client/#/home';
  route: any = 'none yet';

  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute) {}

  
  authenticate() {
    // window.localStorage.getItem((this.JWT_KEY) === 'null' || 'undefined' ? this.endpoint = this.localAuth : this.endpoint = this.tokenAuth;
    this.authService.authenticate()
    .then(()=>this.router.navigate(['']))
  }
}; 