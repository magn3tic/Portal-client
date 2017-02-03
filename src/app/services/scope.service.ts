import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { ApiService, StoreHelper } from './index';
import { Observable } from 'rxjs';
import { Store } from '../store';
import { Hashids } from 'ng2-hashids';
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
    // Change to CONFIG
    hubFormPurgeEndpoint: string = 'https://c1aabba0.ngrok.io/hubFormsPurge';
    hubFormUpdateEndpoint: string = 'https://c1aabba0.ngrok.io/hubFormsUpdate';

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
        return decodeURI(response.json());
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

    purgeScopes() {
        const userEmail = this.store.getState().user['data']['user'];
        let body = JSON.stringify(
            {
                email: userEmail
            }
        );
        console.log('sent: ', body, ' to: ', this.hubFormPurgeEndpoint);
        return new Promise((resolve, reject) => {
            // Async operation to save scope as property on company. Resolve if successful, Reject if unsuccessful.
            this.apiService.post(this.hubFormPurgeEndpoint, body)
                .subscribe(res => {
                    console.log('res: ', res)
                })
        })
    }

    createScope(scope: Object, company: Object) {
        console.log('scope in createScope: ', scope);
        console.log('company in createScope: ', company);
        const userEmail = this.store.getState().user['data']['user'];
        const activeCompany = this.store.getState().activeCompany;
        const scopeObject = this.store.getState().activeScope;
        let currentScopesArray = decodeURI(this.store.getState().user['contactInfo']['properties']['scopes']['value']);
        let body = JSON.stringify(
            {
                email: userEmail,
                scopes: this.updateScopesOnContact(JSON.parse(currentScopesArray), { meta: this.createMetaInfo({ company: activeCompany }), company: activeCompany, scope: scopeObject }),

            }
        );
        console.log('data sent: ', body);
        // Async operation to save scope as property on company. Resolve if successful, Reject if unsuccessful.
        this.apiService.post(this.hubFormUpdateEndpoint, body)
            .subscribe(res => {
                console.log('res: ', decodeURI(res))
            })
    }

    removeScope(hashId) {
        const currentScopesArray = this.store.getState().user['contactInfo']['properties']['scopes']['value'];
        const newScopesArray = _.reject(currentScopesArray, (scopeObj) => {
            return scopeObj.meta.id;
        })
        return newScopesArray;
    }

    updateScopesOnContact(currentScopesArray, newScopeObject: Object) {
        console.log('currentScopesArray is array?: ', Array.isArray(currentScopesArray));
        console.log('currentScopesArray: ', currentScopesArray);
        let tempScopesArr = currentScopesArray;
        tempScopesArr.push(newScopeObject);
        console.log('tempScopesArr: ', tempScopesArr);
        return tempScopesArr;
    }

    getScope(): Promise<any> {
        console.log('in getscope this.scope: ', this.scope);
        this.storeHelper.update('activeScope', this.scope);
        return Promise.resolve(this.store.getState().activeScope);
    }

    createMetaInfo(company) {
        const companyId = company.company.companyId;
        const hashids = new Hashids('', 15);
        const timeStamp = Date.now();
        const newId = hashids.encode(companyId, timeStamp);
        return {
            id: newId
        };
    }

    decodeMetaInfo(hashId) {
        const hashids = new Hashids('', 15);
        return hashids.decode(hashId);
    }
}
