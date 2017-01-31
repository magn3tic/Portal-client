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
    newGHPagesAPI_URL: string = CONFIG.scopeAPI;
    hubFormEndpoint: string = 'http://dev.magne.tc/api/hubspot/submit-scope.php';

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

    createScope(scope: Object, company: Object) {
        console.log('scope in createScope: ', scope);
        console.log('company in createScope: ', company);
        const userEmail = this.store.getState().user['data']['user'];
        const scopeObject = this.store.getState().activeScope;
        let body = JSON.stringify(
            {
                email: userEmail,
                scope: scopeObject
            }
        );


        console.log('data sent: ', body);
        return new Promise((resolve, reject) => {
            // Async operation to save scope as property on company. Resolve if successful, Reject if unsuccessful.
            this.http.post(this.hubFormEndpoint, body, this.headers)
                .subscribe(res => {
                    console.log('res: ', res)
                })
        })
    }

    getScope(): Promise<any> {
        console.log('in get scope api being used is: ', this.newGHPagesAPI_URL);
        console.log('in getscope this.scope: ', this.scope);
        this.storeHelper.update('activeScope', this.scope);
        return Promise.resolve(this.store.getState().activeScope);
    }

    cleanScope(rawScope, next) {
        console.log('in cleanScope rawScope is: ', rawScope)
        let result;
        result = _.omit(rawScope, ['_type']);
        return next(rawScope);
    }
}
