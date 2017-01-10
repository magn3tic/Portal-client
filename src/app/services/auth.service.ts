import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService, StoreHelper } from './index';
import { Store } from '../store';
import 'rxjs/Rx';

declare var swal: any;

@Injectable()
export class AuthService implements CanActivate {
    JWT_KEY: string = 'magnetic_token';
    constructor(
        private router: Router,
        private apiService: ApiService,
        private storeHelper: StoreHelper,
        private store: Store
    ) {
        this.setJwt(window.localStorage.getItem(this.JWT_KEY));
    }

    setJwt(jwt: string) {
        window.localStorage.setItem(this.JWT_KEY, jwt);
        this.apiService.setHeaders({ Authorization: `Bearer ${jwt}` });
    }

    // Set relevent user information to localStorage to submit author credentials with new scopes
    setUser(path) {
        return this.apiService.post(`/${path}`)
            .do(res => this.setJwt(res.token))
            .do(res => this.storeHelper.update('user', res.data))
            .map(res => res.data);
    }

    authenticate() {
    let result = new Promise((resolve, reject) => {
        resolve(true);
    }); 
    return result;
        // return this.apiService.post(`/${path}`, creds)
        //     .do(res => this.setJwt(res.token))
        //     .do(res => this.storeHelper.update('user', res.data))
        //     .map(res => res.data)
        //     .do(
        //     (data) => swal(
        //         'Sweet!',
        //         'Thanks for being a part of #MAGFam ' + '<b>' +this.store.getState().user['email'] + '</b>',
        //         'success'
        //     ),
        //     (err) => swal(
        //         'Oops...',
        //         err.statusText,
        //         'error'
        //     )
        //     );
    }

    signout() {
        window.localStorage.removeItem(this.JWT_KEY);
        this.store.purge();
        this.router.navigate(['', 'auth'])
    }

    isAuthorized(): boolean {
        return (window.localStorage.getItem(this.JWT_KEY) == 'undefined' || window.localStorage.getItem(this.JWT_KEY) == 'null') ? false : true;
    }

    canActivate(): boolean {
        const isAuth = this.isAuthorized();
        // console.log('isAuth: ', isAuth);

        if (!isAuth) {
            this.router.navigate(['', 'auth'])
        }
        return isAuth;
    }

    userIsSuper() {
        return (this.store.getState().user['role'] === "super") ? true : false;
    }

    userIsAdmin() {
        return (this.store.getState().user['role'] === "admin") ? true : false;
    }
}
