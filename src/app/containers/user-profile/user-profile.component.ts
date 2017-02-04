import { Component, OnInit, Input } from '@angular/core';
import { AuthService, MyClients, ApiService, StoreHelper, ClientsService, ScopeService } from '../../services'; // removed socket service temporarily until debugged
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '../../store';
import * as _ from 'lodash';

declare var swal: any;

@Component({
    selector: 'user-profile',
    styles: [require('./user-profile.component.css')],
    template: require('./user-profile.component.html')
})

export class UserProfile implements OnInit {
    me: any;
    scopes: any;
    deletePropertiesArray: Array<any>;
    JWTKEY: string = 'hubspot_token';
    constructor(
        private location: Location,
        private clientsService: ClientsService,
        private router: Router,
        private myClients: MyClients,
        private authService: AuthService,
        private apiService: ApiService,
        private store: Store,
        private storeHelper: StoreHelper,
        private scopeService: ScopeService
    ) {
        this.me = this.getMe();
    }

    ngOnInit() {
        console.log('this.me: ', this.me);
        // if (this.me.contactInfo.properties.scopes.value.indexOf('o') === 0) {
        //     console.log('malformed json');
        // }
        let tempScopesArr = JSON.parse(decodeURI(this.me.contactInfo.properties.scopes.value));
        console.log('tempScopesArr: ', tempScopesArr);
        if (!tempScopesArr.length) {
            // console.log('!JSON.parse(this.me.contactInfo.properties.scopes.value).length: ', JSON.parse(this.me.contactInfo.properties.scopes.value).length);
            return this.scopes = tempScopesArr;
        } else {
            this.storeHelper.update('scopes', tempScopesArr);
            console.log('error before setting tempScopesArr');
            this.scopes = _
            .chain(tempScopesArr)
            .uniqBy('company.properties.name.value')
            .sortBy(['company', 'value'])
            .value()
            console.log('tempScopesArr: ', tempScopesArr);
            console.log('this.scopes: ', this.scopes);
        }

        if (!this.me) {
            console.log('this.me is empty');
        }
        // this.deleteProps(contactKeys);
    }

    getMe() {
        return this.store.getState().user;
    }

    goBack(): void {
        this.location.back();
    }

    /**
     * Delete properties on a contact.
     * Created this function to remove accidentally created scope properties
     * @constructor
     * @param {Array}  properties - contactKeys the keys of properties on contactProps.
     */
    deleteProps(properties: Array<String>) {
        const contactProps = this.me.contactInfo.properties;
        const contactKeys = Object.keys(contactProps);
        this.deletePropertiesArray = _.filter(properties, (key) => {
            return key.startsWith('scope');
        })
        console.log('scopeArray: ', this.deletePropertiesArray);
        if (this.deletePropertiesArray.length > 1) {
            return this.apiService.post('https://c1aabba0.ngrok.io/hubDeleteProps', this.deletePropertiesArray)
                .subscribe(res => console.log('delete response: ', res));
        }
    }

    selectCompany(company, scope) {
        console.log('selected company', company);
        console.log('activeScope ', scope);
        this.storeHelper.update('activeCompany', company);
        this.storeHelper.update('activeScope', scope);
    }

    purgeScopes() {
        return this.scopeService.purgeScopes()
            .then(res => {
                this.updateScopes();
            })
            .catch(err => console.log('this.scopeService.purgeScopes() error: ', err));
    }

    updateScopes() {
        this.authService.getUser(localStorage.getItem(this.JWTKEY));
    }
}