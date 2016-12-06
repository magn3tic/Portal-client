import { Component, OnInit } from '@angular/core';
import { ApiService, StoreHelper, AuthService } from '../../services' // removed socketService temporarily until debugged
import { Router } from '@angular/router';
import { Store } from '../../store';

declare var swal: any;

@Component({
    selector: 'admin',
    styles: [require('./admin.component.css')],
    template: require('./admin.component.html')
})

export class Admin implements OnInit {
    viewTeam: Boolean = false;
    addClient: Boolean = false;
    // This endpoint is what validates and returns a user via JWT
    user = {
        email: '',
        password: '',
        role: ''
    };
    users = [];
    usersEndpoint: string = "/users";
    client: Object = {
        name: ''
    };
    clientManager: Object;
    clients: Array<any> = [];
    clientEndpoint: string = "/clients";
    super: boolean;
    roles: Array<any> = ['authenticated_user', 'admin', 'super'];
    constructor(private router: Router, private apiService: ApiService, private store: Store, private storeHelper: StoreHelper, private authService: AuthService) { }

    ngOnInit() {
        this.getUsers();
        this.super = this.authService.userIsSuper();
        // console.log('ngOnInit users: ', this.users);
        // this.socketService.get('users', 'find');
    }

    createUser() {
        let self = this;
        this.apiService.post(this.usersEndpoint, this.user)
            .do((res) => this.storeHelper.update('users', res.data))
            .do(() => this.viewTeam = true)
            .subscribe(() => this.getUsers())
    }

    getUsers() {
        this.apiService.get(this.usersEndpoint)
            .do((res) => this.storeHelper.update('users', res.data))
            .subscribe(() => this.users = this.store.getState()['users'])
    }

    removeUser(user: any) {
        console.log('removeUser clicked: ', user);
        this.apiService.delete(`/users/${user['_id']}`)
            .subscribe(() => this.getUsers())
    }

    createClient() {
        let self = this;
        this.clientManager = this.store.getState().user;
        this.apiService.post(this.clientEndpoint, 
        {
            name: this.client['name'],
            data: {
                // We can add as many data points as we want here
            },
            manager: this.clientManager
        })
            .do((res) => this.storeHelper.update('clients', res.data))
            .subscribe(() => {
                this.getClient()
                this.router.navigate(['clients'])
            });
            
    }

    getClient() {
        this.apiService.get(this.clientEndpoint)
            .do((res) => this.storeHelper.update('clients', res.data))
            .subscribe(() => this.clients = this.store.getState()['clients'])
    }

    removeClient(user: any) {
        console.log('removeUser clicked: ', user);
        this.apiService.delete(`/users/${user['_id']}`)
            .subscribe(() => this.getClient())
    }

    toggleViewTeam() {
        this.viewTeam = !this.viewTeam;
        this.addClient = false;
    }

    toggleAddClient() {
        this.addClient = !this.addClient;
        this.viewTeam = false;
    }
}