import { Component, OnInit } from '@angular/core';
import { AuthService, StoreHelper, ClientsService, ScopeService } from '../../services';
import {Store} from '../../store';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

var _ = require('lodash');
declare var CONFIG;

@Component({
    selector: 'main-container',
    styles: [require('./main.component.css')],
    template: require('./main.html')
})

export class Main implements OnInit{
    busy: Subscription;
    isLoading: boolean = false;
    isLoader: boolean = false;
    magHttpsProxy: string = CONFIG.magneticProxy;
    hubspotAPIAllContacts = CONFIG.hubspot.endpoints.allContacts;
    hubspotAPIAllDeals = CONFIG.hubspot.endpoints.allDeals;
    // This endpoint is what validates and returns a user via JWT
    token_endpoint: string = 'auth/token';
    user_role: any;
    user_email: string;
    super: boolean;
    admin: boolean;
    constructor(private store: Store, private storeHelper: StoreHelper, private clientsService: ClientsService, private authService: AuthService, private scopeService: ScopeService, private router: Router) { 
        this.store
        .changes
        .pluck('isLoading')
        .subscribe((isLoading: boolean) => this.isLoader = isLoading)
    }

    ngOnInit() {
        if(this.authService.isAuthorized()) {
            console.log('main.ts isAuthorized is true');
            this.router.navigate(['home']);
        } else {
            console.log('main.ts oninit this.authService.isAuthorized() returned false');
            this.router.navigate(['auth']);
        }
    }

    logout() {
        this.authService.signout();
    }

    showLoader(isLoading: boolean) {
        const currentState = this.store.getState();
        currentState.isLoading = isLoading;
        this.store.setState(Object.assign({}, currentState, { isLoading }));
    }
}