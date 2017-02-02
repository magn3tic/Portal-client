import { Component, OnInit, Input } from '@angular/core';
import { AuthService, MyClients, ApiService, StoreHelper, ClientsService } from '../../services'; // removed socket service temporarily until debugged
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
    constructor(private location: Location, private clientsService: ClientsService, private router: Router, private myClients: MyClients, private authService: AuthService, private apiService: ApiService, private store: Store, private storeHelper: StoreHelper) { this.me = this.getMe(); }

    ngOnInit() {
        console.log('this.me: ', this.me);
        let tempScopesArr = JSON.parse(this.me.contactInfo.properties.scopes.value);
        this.scopes = _.sortBy(tempScopesArr, (sObj) => {
            return sObj['company'].properties.name.value;
        }, ['desc']);
        console.log('tempScopesArr: ', tempScopesArr);
        console.log('this.scopes: ', this.scopes);

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
}