import { Component, Input, Output, trigger, state, style, transition, animate, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ScopeService, StoreHelper } from '../../services';
// import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router } from '@angular/router';
import { Store } from '../../store';

declare var CONFIG: any;
declare var swal: any;
declare var scope: any;

var _ = require('lodash');
_.mixin(require("lodash-deep"));

@Component({
    selector: 'scope-display',
    styles: [require('./scope-display.component.css')],
    template: require('./scope-display.component.html'),
    animations: [
        trigger('itemState', [
            state('false', style({
                backgroundColor: '#F19495',
                padding: '.3em',
                transform: 'scale(1)'
            })),
            state('true', style({
                backgroundColor: '#3BB089',
                padding: '.5em',
                transform: 'scale(1.03)'
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})
export class ScopeDisplay {
    api_url: string = CONFIG.API_URL;
    host: string = this.api_url;
    id: number;
    scope: Object;
    companies: Array<Object>;
    company: Object;
    private sub: any;

    public scopeResult: Array<any> = [];

    constructor(private route: ActivatedRoute, private storeHelper: StoreHelper, private scopeService: ScopeService, private store: Store, private router: Router, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.setScope()
            .then(scopeObject => {
                this.scope = scopeObject
                console.log('scope-display nginit this.scope: ', this.scope);
                this.company = this.store.getState()['activeCompany'];
                console.log('scope-display nginit this.company: ', this.company);
            });
    }

    private setScope(): Promise<any> {
        var self = this;
        if(!this.store.getState().activeScope){
            return this.scopeService.getScope()
                .then(scopeObject => {
                    if (scopeObject) {
                        console.log('scopeObject in setScope: ', scopeObject);
                        return Promise.resolve(scopeObject);
                    } else {
                        return Promise.reject('no scopeObject returned from scopeService.getScope()');
                    }
                });
        } else {
            return Promise.resolve(this.store.getState().activeScope);
        }
    }

    public saveScope() {
        // Need to place the majority of the logic here in the scope service
        if (!window.localStorage['hubspot_token']) {
            swal(
                'Error No User',
                'You must be logged in to do that! Please login!',
                'error'
            ).then(() => {
                this.router.navigate(['', 'auth'])
            })
        } else {
            let self = this;
            swal({
                title: 'Save Scope?',
                text: "You won't be able to revert this!",
                type: 'info',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes, save it'
            }).then(function () {
                self.scopeResult = [];
                // scopeService.createScope returns a promise
                return self.scopeService.createScope(self.scope, self.company)
                    // .then(res => {
                    //     console.log('success res: ', res);
                    //     swal(
                    //         'Saved!',
                    //         'Relax... Your Scope has been saved',
                    //         'success'
                    //     );
                    // })
                    // .catch(err => console.log('createScope failed err: ', err))
            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'
                if (dismiss === 'cancel') {
                    swal(
                        'Cancelled',
                        'Scope not saved',
                        'error'
                    );
                }
            })
        }
    }

    toggleShow(e, scopeItem) {
        console.log('e clicked: ', e.currentTarget.nextSibling.nextSibling);
        let elementToToggle = e.currentTarget.nextSibling.nextSibling;
        elementToToggle.classList.toggle('hide');
    }

    resetScope() {
        this.setScope();
    }

    toggleActive(item, parents: Array<any>) {
        _.map(parents, item => item.active = true)
        parents['active'] = !parents['active'];
        return item.active = !item.active
    }
}