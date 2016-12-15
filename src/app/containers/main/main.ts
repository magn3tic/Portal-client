import { Component, OnInit } from '@angular/core';
import { AuthService, StoreHelper, ClientsService, ScopeService } from '../../services';

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
    constructor(private storeHelper: StoreHelper, private clientsService: ClientsService, private authService: AuthService, private scopeService: ScopeService) { }

    ngOnInit() {
        const self = this;
        // get user on initial load
        this.authService.setUser(this.token_endpoint)
        .subscribe(res => {
            this.user_email = res.email;
            this.super = this.authService.userIsSuper();
            this.admin = this.authService.userIsAdmin();
            this.storeHelper.update('user', res);
        });

        // get clients on initial load
        this.clientsService.fetchDeals(this.hubspotAPIAllDeals, 'allDeals', 'includeAssociations=true&limit=250&properties=stage')
        .subscribe(res => {
            console.log('get all deals res: ', res);
            let tempCompanyIdArr = [];
            let clients = _.filter(res.data.deals, obj => {
                return obj.associations.associatedCompanyIds[0] != undefined;
            })
            clients.forEach(client => tempCompanyIdArr.push(client.associations.associatedCompanyIds[0]));
            this.clientsService.fetchCompanies(tempCompanyIdArr);
        })
        
        // get scope object on initial load
        this.scopeService.getScope();
        // changed for https requirement of gh-pages... our api is http.
        // .subscribe(res=> this.storeHelper.update('scope', res));

    }

    logout() {
        this.authService.signout();
    }
}