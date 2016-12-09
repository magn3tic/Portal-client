import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { ApiService, StoreHelper } from './index';
import { Observable } from 'rxjs';
import { Store } from '../store';
import 'rxjs/Rx';

declare var CONFIG: any;
var _ = require('lodash');
_.mixin(require("lodash-deep"));

@Injectable()
export class ScopeService {
    headers: Headers = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
    });
    magAPI_URL: string = 'https://dev.magne.tc/scope-api/v1/';
    newGHPagesAPI_URL: string = '/scope.json';
    testing = 'testing';

    scope = CONFIG.scope;

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

    createScope(path: string, id: any, body: any) {
        console.log('body in createScope: ', body);
        this.apiService.update(path, id, body)
            .subscribe(res => console.log('server response: ', res))
    }

    getScope() : Observable<any> {
        console.log('in get scope api being used is: ', this.newGHPagesAPI_URL);
        // changed for https requirement of gh-pages... our api is http.
        return this.http.get(this.newGHPagesAPI_URL + '?o', {headers: this.headers})
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
