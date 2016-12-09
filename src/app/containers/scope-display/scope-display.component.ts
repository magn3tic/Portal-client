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
      state('true',   style({
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
    clients: Array<Object>;
    client: Object;

    public scopeResult: Array<any> = [];

    constructor(private route: ActivatedRoute, private storeHelper: StoreHelper, private scopeService: ScopeService, private store: Store, private router: Router, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.setScope();
        this.clients = this.store.getState().clients;
        return this.route.params.subscribe(params => {
            this.id = params['_id']; // (+) converts string 'id' to a number
            this.findClient(this.id);
        });
    }

    findClient(clientID) {
        let self = this;
        //get client through route params
        this.client = (_.find(this.clients, { _id: clientID })) ?
            _.find(this.clients, { _id: clientID }) : self.router.navigate(['clients'])
                .then(() => {
                    swal(
                        'No Client Data',
                        "Returning to clients view",
                        'error'
                    )
                })
        console.log('this.client: ', this.client)
        this.storeHelper.update('activeClient', this.client);
    }

    ngAfterViewChecked() {
        // console.log('ngAfterViewChecked ran!');
    }

    private setScope() {
        var self = this;
        this.scopeService.getScope()
            // changed for https requirement of gh-pages... our api is http.
            .subscribe((res) => {
                this.scopeService.cleanScope(res, function (res) {
                    console.log('ngOnInit cleanScope callback: ', res);
                    self.storeHelper.add('scope', res);
                    self.scope = self.store.getState().scope[0];
                    console.log('self.scope: ', self.scope);
                })
            });
    }

    public saveScope() {
        // Need to place the majority of the logic here in the scope service
        if (!window.localStorage['magnetic_token']) {
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
                swal(
                    'Saved!',
                    'Relax... Your Scope has been saved',
                    'success'
                );
                self.scopeResult = [];
                self.scope['client'] = self.client;
                return self.scopeService.createScope('/clients', self.store.getState()['activeClient']['_id'], {scope: self.scope, data: self.scope['client']});
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