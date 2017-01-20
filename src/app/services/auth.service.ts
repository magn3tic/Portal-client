import { Injectable } from '@angular/core';
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
    // HUBAUTHAPI: string = CONFIG.hubspot.HUBAUTHAPI;
    HUBAUTHAPI: string = 'https://3af9c93a.ngrok.io/hubAuth';
    HUBJWTPURGE: string = 'https://3af9c93a.ngrok.io/hubLogout';
    HUBTOKEN: string = null;
    constructor(
        private router: Router,
        private apiService: ApiService,
        private storeHelper: StoreHelper,
        private store: Store,
        private http: Http
    ) {/** constructor body **/ }

    setJwt(jwt: string, key?: string) {
        let jwt_key = (key) ? key : this.JWTKEY;
        return new Promise((resolve, reject) => {
            window.localStorage.setItem(jwt_key, jwt);
            if (window.localStorage.getItem(jwt_key)) {
                this.apiService.setHeaders({ Authorization: `Bearer ${jwt[jwt_key]}`});
                resolve(jwt)
            } else {
                reject('no jwt_key in localStorage')
            }
        })
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
            if(window.localStorage['hubspot_token']) {
                window.localStorage.clear()
                resolve('cleared localStorage')
            } else if(window.localStorage['hubspot_token'] === 'undefined'){
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
            this.router.navigate(['/']);
        })
        .catch(err => console.log('error in promise.all: ', err))
        // this.clearServerToken()
        //     .then(status => {
        //         console.log('status is: ', status);
        //         window.localStorage.removeItem(this.JWTKEY);
        //         if (status <= 202) {
        //             swal({
        //                 title: 'Successfully Logged Out',
        //                 text: 'Thanks for using our portal',
        //                 timer: 200,
        //             }).then(() => {

        //             }, (dismiss) => {
        //                 if (dismiss === 'timer') {
        //                     console.log('I was closed by the timer')
        //                 }
        //             })
        //             this.router.navigate(['/auth'])
        //         } else {
        //             console.error('status of clearServerToken: ', status);
        //         }
        //     })
            .catch(err => console.log(err));
    }

    // Set relevent user information to localStorage to submit author credentials with new scopes
    setUser(path) {
        return this.apiService.post(`/${path}`)
            .do(res => this.setJwt(res.token))
            .do(res => this.storeHelper.update('user', res.data))
            .map(res => res.data);
    }

    authenticate() {
        const self = this;
        let result = new Promise((resolve, reject) => {
            if (window.localStorage.getItem(this.JWTKEY)) {
                resolve(window.localStorage.getItem(this.JWTKEY))
            } else if (window.localStorage.getItem(this.JWTKEY).length < 1) {
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
        return (window.localStorage.getItem(this.JWTKEY) == 'undefined' || window.localStorage.getItem(this.JWTKEY) == null) || !window.localStorage.getItem(this.JWTKEY).length ? false : true;
    }

    canActivate(): boolean {
        const isAuth = this.isAuthorized();
        console.log('isAuth: ', isAuth);

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
