import { Component, OnInit } from '@angular/core';
import { AuthService, StoreHelper, ClientsService, ScopeService } from '../../services';
import {Router} from '@angular/router';

var _ = require('lodash');
declare var CONFIG;

@Component({
    selector: 'main-container',
    styles: [require('./main.component.css')],
    template: require('./main.html')
})

export class Main implements OnInit{
    magHttpsProxy: string = CONFIG.magneticProxy;
    hubspotAPIAllContacts = CONFIG.hubspot.endpoints.allContacts;
    hubspotAPIAllDeals = CONFIG.hubspot.endpoints.allDeals;
    // This endpoint is what validates and returns a user via JWT
    token_endpoint: string = 'auth/token';
    user_role: any;
    user_email: string;
    super: boolean;
    admin: boolean;
    constructor(private storeHelper: StoreHelper, private clientsService: ClientsService, private authService: AuthService, private scopeService: ScopeService, private router: Router) { }

    ngOnInit() {
        if(this.authService.isAuthorized()) {
            this.router.navigate(['home']);
        }
    }

    logout() {
        this.authService.signout();
    }
}