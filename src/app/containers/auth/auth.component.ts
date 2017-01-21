import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';
import { Router } from '@angular/router';

declare var CONFIG: any;

@Component({
  selector: 'auth-container',
  styles: [`
    a:hover {
        cursor: pointer;
      }
  `],
  template: require('./auth.component.html')
})

export class Auth implements OnInit {
  // This initiates a Oauth 2.0 connection via passport.js
  // hubAuthAPI: string = CONFIG.hubspot.HUBAUTHAPI; // Hide this in config vars
  hubAuthAPI: string = 'https://3af9c93a.ngrok.io/hubAuth';

  constructor(private router: Router, private authService: AuthService) {
    // console.log('hubauthapi: ', this.hubAuthAPI);
  }

  ngOnInit() {
    if (this.authService.isAuthorized()) {
      this.router.navigate(['home']);
    }
  }


  authenticate() {
    // window.localStorage.getItem((this.JWT_KEY) === 'null' || 'undefined' ? this.endpoint = this.localAuth : this.endpoint = this.tokenAuth;
    this.authService.authenticate()
      .then(token => console.log('authservice.authenticate promise returned: ', token))
      .catch(err => console.log('auth promise rejection: ', err))
  }
}; 