import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { ApiService, StoreHelper } from './index';
import { Observable } from 'rxjs';
import { Store } from '../store';
import 'rxjs/Rx';

var _ = require('lodash');
_.mixin(require("lodash-deep"));

@Injectable()
export class ScopeService {
    headers: Headers = new Headers({
        // 'Content-Type': 'application/json',
        Accept: 'application/json'
    });
    magAPI_URL: string = 'http://dev.magne.tc/scope-api/v1/';
    constructor(
        private router: Router,
        private apiService: ApiService,
        private storeHelper: StoreHelper,
        private store: Store,
        private http: Http
    ) {
    }

    private getJson(response: Response) {
        return response.json();
    }

    private checkForError(response: Response): Response {
        console.log('checkForError');
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText);
            error['response'] = response;
            console.error(error);
            throw error;

        }
    }

    createScope(path: string, body: any) {
        let cleanObj = _.forEach(body, (obj)=> {
            _.deepMapValues(_.reject(obj, (val)=> {
                console.log(' in deep map val: ', val);
                return console.log(!val.active);
            }))
        })
        this.apiService.post(path, cleanObj)
            .subscribe(res => console.log('server response: ', res))
    }

    getScope(): Observable<any> {
        return this.http.get(this.magAPI_URL + '?o', {headers: this.headers})
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson)
    }

    cleanScope(rawScope, next) {
        console.log('in cleanScope rawScope is: ', rawScope)
        let result;
        result = _.omit(rawScope,['_type']);
        return next(rawScope);
    }
}
