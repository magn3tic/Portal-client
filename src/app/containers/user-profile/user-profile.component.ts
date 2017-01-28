import { Component, OnInit, Input } from '@angular/core';
import { AuthService, MyClients, ApiService, StoreHelper, ClientsService } from '../../services'; // removed socket service temporarily until debugged
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import {Store} from '../../store';

declare var swal: any;

@Component({
    selector: 'user-profile',
    styles: [require('./user-profile.component.css')],
    template: require('./user-profile.component.html')
})

export class UserProfile implements OnInit {
    // This endpoint is what validates and returns a user via JWT
    token_endpoint: string = 'auth/token';
    me: any;
    email: string = '';
    endpoint: string = 'users';
    super: boolean;
    clients: Array<any>;
    constructor(private location: Location, private clientsService: ClientsService, private router: Router, private myClients: MyClients, private authService: AuthService, private apiService: ApiService, private store: Store, private storeHelper: StoreHelper) { }

    ngOnInit() {
        this.me = this.getMe();
        console.log('this.me: ', this.me);
        if(!this.me) {
            console.log('this.me is empty');
        } else {
            this.getMyClients(this.me.user);
        }
    }

    getMe() {
        return this.store.getState().user['data'];
    }

    getMyClients(userEmail) {
        console.log('in profile this.clients: ', this.store.getState().clients);
        return this.store.getState().clients;
    }

    goBack(): void {
      this.location.back();
    }
}