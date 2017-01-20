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
    ) {/** constructor body **/}

    setJwt(jwt: string, key?: string) {
        let jwt_key = (key) ? key : this.JWTKEY;
        return new Promise((resolve, reject) => {
            window.localStorage.setItem(jwt_key, jwt);
            if (window.localStorage.getItem(jwt_key)) {
                this.apiService.setHeaders({ Authorization: `Bearer ${jwt['accessToken']}` });
                resolve(jwt)
            } else {
                reject('no jwt_key in localStorage')
            }
        })
    }

    clearJWT() {
        return new Promise((resolve, reject) => {
            this.apiService.get(this.HUBJWTPURGE)
                .subscribe(statusCode => {
                    console.log('statusCode in clearJWT: ', statusCode);
                    if (statusCode === 202) {
                        resolve(statusCode);
                    } else {
                        reject('error in clearJWT: ' + statusCode);
                    }
                })
        })
    }

    signout() {
        this.store.purge();
        this.clearJWT()
            .then(status => {
                window.localStorage.removeItem(this.JWTKEY);
                console.log('status is: ', status);
                if (status === 202) {
                    swal({
                        title: 'Successfully Logged Out',
                        text: 'Thanks for using our portal',
                        timer: 200,
                    }).then(() => {

                    }, (dismiss) => {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                        }
                    })
                    this.router.navigate(['/auth'])
                } else {
                    console.error('status of clearJWT: ', status);
                }
            })
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
        let result = new Promise((resolve, reject) => {
            if (window.localStorage.getItem(this.JWTKEY)) {
                resolve(window.localStorage.getItem(this.JWTKEY))
            } else if (window.localStorage.getItem(this.JWTKEY).length < 1) {
                this.http.get(this.HUBAUTHAPI)
                    .map((res) => this.HUBTOKEN = res['access_token'])
                    .do(token => window.localStorage.setItem(this.JWTKEY, this.HUBTOKEN));
            } else {
                reject('auth service authenticate rejection. No hubspot token provided in auth.service.ts authenticate()')
            }
        });
        return result;
    }


    isAuthorized(): boolean {
        return (window.localStorage.getItem(this.JWTKEY) == 'undefined' || window.localStorage.getItem(this.JWTKEY) == 'null') ? false : true;
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
