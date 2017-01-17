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
  hubAuthAPI: string = 'https://cf4fc706.ngrok.io/hubAuth';
  route: any = 'none yet';

  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute) {}

  
  authenticate() {
    // window.localStorage.getItem((this.JWT_KEY) === 'null' || 'undefined' ? this.endpoint = this.localAuth : this.endpoint = this.tokenAuth;
    this.authService.authenticate()
    // .then(()=>this.router.navigate(['']))
  }
}; 