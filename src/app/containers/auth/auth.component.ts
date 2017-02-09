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
  // Prod
  HUBAUTH: string = `${CONFIG.HUBSPOTPROXY.APIURL + CONFIG.HUBSPOTPROXY.HUBAUTH}`;

  constructor(
    private router: Router, 
    private authService: AuthService
    ) {}

  ngOnInit() {
    if (this.authService.isAuthorized()) {
      console.log('this.authService.isAuthorized(): ', this.authService.isAuthorized());
    }
  }


  authenticate() {
    this.authService.authenticate()
      .then(token => {
        console.log('authservice.authenticate promise returned: ', token)
        this.router.navigate(['profile']);
      })
      .catch(err => console.log('auth promise rejection: ', err))
  }
}; 