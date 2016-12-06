import { Component } from '@angular/core';
import {AuthService} from '../../services';
import {Router} from '@angular/router';

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
  JWT_KEY: string = 'magnetic_token';
  user = {
    email: '',
    password: ''
  };
  mode: string = 'signin';
  localAuth: string = 'auth/local';
  tokenAuth: string = 'auth/token';
  endpoint: string = 'auth/local';

  constructor(private router: Router, private authService: AuthService) {}

  authenticate() {
    window.localStorage.getItem(this.JWT_KEY) === 'null' || 'undefined' ? this.endpoint = this.localAuth : this.endpoint = this.tokenAuth;
    this.authService.authenticate(this.endpoint, this.user)
    .subscribe(()=>this.router.navigate(['']))
  }
}; 