import { Component } from '@angular/core';
import {AuthService} from '../../services';
import {Router} from '@angular/router';

@Component({
  selector: 'create-user-form',
  styles: [`
    a:hover {
        cursor: pointer;
      }
  `],
  template: require('./create-user.component.html')
})

export class CreateUserForm {
  user = {
    email: '',
    password: '',
    roles: []
  };
  endpoint: string = 'users';

  constructor(private router: Router, private authService: AuthService) {}

  authenticate() {
    this.authService.authenticate()
    .then(()=>this.router.navigate(['']))
  }
}; 