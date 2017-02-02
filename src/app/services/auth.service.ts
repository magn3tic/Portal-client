import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CanActivate, Router } from '@angular/router';
import { ApiService, StoreHelper } from './index';
import { Store } from '../store';
import 'rxjs/Rx';

declare var CONFIG: any;
declare var swal: any;

@Injectable()
export class AuthService implements CanActivate {
    // JWTKEY: string = CONFIG.hubspot.JWTKEY;
    JWTKEY: string = 'hubspot_token';
    JWT: string = localStorage.getItem(this.JWTKEY);
    // HUBAUTHAPI: string = CONFIG.hubspot.HUBAUTHAPI;
    HUBAUTHAPI: string = 'https://c1aabba0.ngrok.io/hubAuth';
    HUBSPOTPROXY: string = 'https://c1aabba0.ngrok.io/hubAPI';
    HUBJWTPURGE: string = 'https://c1aabba0.ngrok.io/hubLogout';
    HUBME: string = 'https://c1aabba0.ngrok.io/hubMe';
    HUBTOKEN: string = null;
    constructor(
        private router: Router,
        private apiService: ApiService,
        private storeHelper: StoreHelper,
        private store: Store,
        private http: Http
    ) {
        /** constructor body **/
        const token = localStorage.getItem(this.JWTKEY)

        if (token) {
            this.setJwt(token);
            console.log('token is true: ', token);
        } else {
            this.authenticate()
                .then(token => console.log('authservice constructor authenticate call returned: ', token))
                .catch(err => console.log('authservice constructor authenticate call error ', err));
        }
    }

    setJwt(jwt: string) {
        console.log('set jwt called and jwt: ', jwt);
        if (window.localStorage.getItem(this.JWTKEY)) {
            this.apiService.setHeaders({ Authorization: `Bearer ${jwt}` });
        } else {
            window.localStorage.setItem(this.JWTKEY, jwt)
        }
    }

    clearServerToken() {
        console.log('clearServerToken called')
        return new Promise((resolve, reject) => {
            this.apiService.get(this.HUBJWTPURGE)
                .subscribe(res => {
                    console.log('res in clearServerToken: ', res);
                    if (res.status >= 200 && res.status < 300) {
                        console.log('clearServerToken res is a number: ', res);
                        resolve('successfully cleared server')
                    }
                    else {
                        console.log('error in auth clearServerToken');
                        reject(res);
                    }
                })
        })
    }

    clearLocalStorage() {
        console.log('clearing localStorage');
        return new Promise((resolve, reject) => {
            if (window.localStorage['hubspot_token']) {
                window.localStorage.clear()
                resolve('cleared localStorage')
            } else if (window.localStorage['hubspot_token'] === 'undefined') {
                resolve('local storage already clear')
            } else {
                reject('error clearing localStorage');
            }
        })
    }

    signout() {
        console.log('signout called');
        this.store.purge();
        return Promise.all([this.clearLocalStorage(), this.clearServerToken()])
            .then(res => {
                console.log('successful signout res: ', res);
                this.router.navigate(['auth']);
            })
            .catch(err => {
                console.log('error in promise.all: ', err)
                if (!localStorage.getItem(this.JWTKEY)) {
                    console.log('tryed to signout but localStorage already empty, should now redirect to auth');
                    this.router.navigate(['auth']);
                }
            })
    }

    // Set relevent user information (access_token and refresh_token) to localStorage to submit author credentials with new scopes
    setUser(path) {
        return this.apiService.post(`/${path}`)
            .do(res => this.setJwt(res.token))
            .map(res => res.data);
    }

    // Get user information (hubspot user object) from hubspot. Different from setUser.
    getUser(token) {
        console.log('get user called with token: ', token);
        return this.apiService.post(this.HUBME)
            .do(res => {
                console.log('getUser res: ', res)
            })
            .map(res => res)
    }

    authenticate() {
        const self = this;
        let result = new Promise((resolve, reject) => {
            if (window.localStorage.getItem(this.JWTKEY)) {
                resolve(window.localStorage.getItem(this.JWTKEY))
            } else if (!window.localStorage.getItem(this.JWTKEY)) {
                this.apiService.get(this.HUBAUTHAPI)
                    .map((res) => {
                        console.log('AuthService.authenticate conditional no hubspot_token in localStorage. apiService.get(HUBAUTHAPI) res: ', res);
                        self.HUBTOKEN = res['access_token']
                    })
                    .do(token => window.localStorage.setItem(this.JWTKEY, this.HUBTOKEN));
            } else {
                reject('auth service authenticate rejection. No hubspot token provided in auth.service.ts authenticate()')
            }
        });
        return result;
    }

    isAuthorized(): boolean {
        console.log('isAuthorized() this.JWT: ', this.JWT);
        if (!this.JWT) {
            console.log('no JWT in localStorage');
            this.JWT = localStorage.getItem(this.JWTKEY);
        }
        return Boolean(this.JWT);
    }

    canActivate(): boolean {
        // console.log('can activate called');
        // if (localStorage.getItem('hubspot_token')) {
        //     this.router.navigate(['/profile']);
        //     return true
        // }
        // console.log('canActivate false');
        // this.router.navigate(['/auth']);
        // return false
        const canActivate = this.isAuthorized();
        this.onCanActivate(canActivate);
        return canActivate;
    }

    onCanActivate(canActivate: boolean) {
        console.log('onCanActivate ran: ', canActivate);
        if (!canActivate) {
            this.router.navigate(['', 'auth']);
        }
    }
}
