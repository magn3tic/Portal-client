import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CanActivate, Router } from '@angular/router';
import { ApiService, StoreHelper } from './index';
import { Store } from '../store';
import 'rxjs/Rx';

declare var CONFIG: any;
declare var swal: any;

@Injectable()
export class AuthService implements CanActivate {
    JWTKEY: string = CONFIG.hubspot.JWTKEY;
    HUBAUTHAPI: string = CONFIG.hubspot.HUBAUTHAPI;
    HUBTOKEN: string = null;
    constructor(
        private router: Router,
        private apiService: ApiService,
        private storeHelper: StoreHelper,
        private store: Store,
        private http: Http,
        private response: Response
    ) {
        this.setJwt(window.localStorage.getItem(this.JWTKEY));
    }

    setJwt(jwt: string) {
        window.localStorage.setItem(this.JWTKEY, jwt);
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
        if(window.localStorage.getItem(this.JWTKEY)) {
          resolve(window.localStorage.getItem(this.JWTKEY))
        } else if(window.localStorage.getItem(this.JWTKEY).length < 1) {
          this.http.get(this.HUBAUTHAPI)
          .map((res) => this.HUBTOKEN = res['access_token'])
          .do(token => window.localStorage.setItem(this.JWTKEY, this.HUBTOKEN));
        } else {
            reject('auth service authenticate rejection. No hubspot token provided in auth.service.ts authenticate()')
        }
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
        window.localStorage.removeItem(this.JWTKEY);
        this.store.purge();
        this.router.navigate(['', 'auth'])
    }

    isAuthorized(): boolean {
        return (window.localStorage.getItem(this.JWTKEY) == 'undefined' || window.localStorage.getItem(this.JWTKEY) == 'null') ? false : true;
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
