import { Component, OnInit } from '@angular/core';
import { AuthService, StoreHelper, ClientsService, ScopeService } from '../../services';

@Component({
    selector: 'main-container',
    styles: [require('./main.component.css')],
    template: require('./main.html')
})

export class Main implements OnInit{
    // This endpoint is what validates and returns a user via JWT
    token_endpoint: string = 'auth/token';
    user_role: any;
    user_email: string;
    super: boolean;
    admin: boolean;
    constructor(private storeHelper: StoreHelper, private clientsService: ClientsService, private authService: AuthService, private scopeService: ScopeService) { }

    ngOnInit() {
        // get user on initial load
        this.authService.setUser(this.token_endpoint)
        .subscribe(res => {
            this.user_email = res.email;
            this.super = this.authService.userIsSuper();
            this.admin = this.authService.userIsAdmin();
            this.storeHelper.update('user', res);
            // console.log('this.super: ', this.super, ' authservice res: ', res);
        });

        // get clients on initial load
        this.clientsService.fetchClients()
        .subscribe(res=> this.storeHelper.update('clients', res.data));
        
        // get scope object on initial load
        this.scopeService.getScope();
        // changed for https requirement of gh-pages... our api is http.
        // .subscribe(res=> this.storeHelper.update('scope', res));

    }

    logout() {
        this.authService.signout();
    }
}