import { Component } from '@angular/core';
import {AuthService} from '../../services';
import {Router, ActivatedRoute} from '@angular/router';

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

export class Auth {
  // This initiates a Oauth 2.0 connection via passport.js
  hubAuthAPI: string = CONFIG.HUBAUTHAPI; // Hide this in config vars
  route: any = 'none yet';

  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute) {}

  
  authenticate() {
    // window.localStorage.getItem((this.JWT_KEY) === 'null' || 'undefined' ? this.endpoint = this.localAuth : this.endpoint = this.tokenAuth;
    this.authService.authenticate()
    // .then(()=>this.router.navigate(['']))
  }
}; 