import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ScopeService } from '../../services';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import {Router} from '@angular/router';
import { Store } from '../../store';

declare var CONFIG: any;
declare var swal: any;

var _ = require('lodash');
_.mixin(require("lodash-deep"));

@Component({
    selector: 'drag-sample',
    styles: [require('./dragula.component.css'), require('./dragula.component.min.css')],
    template: require('./dragula.component.html')
})
export class DragulaSample {
    api_url: string = CONFIG.API_URL;
    host: string =  this.api_url;
    public scope: Array<any> = [
        {
            name: 'Group A',
            items: [
                {
                    name: 'Scope: Brand Discovery',
                    description: 'Humblebrag kale chips lumbersexual, swag ennui live-edge banh mi.'
                },
                {
                    name: 'Scope B', description: 'Lorem ipsum, hipsum, dimsum  90s four dollar toast franzen. Sriracha 8-bit hot chicken.'
                },
                {
                    name: 'Scope C',
                    description: 'Lorem ipsum, hipsum, dimsum'
                },
                {
                    name: 'Scope D',
                    description: 'Lorem ipsum, hipsum, dimsum'
                }
            ]
        },
        {
            name: 'Group B',
            items: [
                {
                    name: 'Scope 1',
                    description: 'Lorem ipsum, hipsum, dimsum'
                },
                {
                    name: 'Scope 2',
                    description: 'Lorem ipsum, hipsum, dimsum'
                },
                {
                    name: 'Scope 3',
                    description: 'Lorem ipsum, hipsum, dimsum'
                },
                {
                    name: 'Scope 4',
                    description: 'Lorem ipsum, hipsum, dimsum'
                }
            ]
        }
    ];
    sections: Array<any>;

    public scopeResult: Array<any> = [];

    constructor(private dragulaService: DragulaService, private scopeService: ScopeService, private store: Store, private router: Router) {
        dragulaService.drop.subscribe((value) => {
            console.log(`drag: ${value[0]}`);
            this.onDrop(value.slice(1));
        })
    }
    
    ngOnInit() {
        this.scopeService.getScope()
        // .subscribe((res) => {
        //     console.log('scope api: ', res)
        //     this.scope.API['phases']=_.keys(res);
        //     this.sections = Object.keys(this.scope);
        //     console.log("sections: ", this.sections);
        // });
    }

    private onDrop(args) {
        let [e, el] = args;
        // do something
        var argsResult = _
            .deepMapValues(args, (val, path) => console.log('val: ', val, ' path: ', path))
            .forEach((val, key) => { this.scopeResult.push(this.scopeResult[key] = val.innerText) })
        console.log(this.scopeResult);
    }

    public saveScope() {
        // Need to place the majority of the logic here in the scope service
        if (!window.localStorage['magnetic_token']) {
            swal(
                'Error No User',
                'You must be logged in to do that! Please login!',
                'error'
            ).then(()=> {
                this.router.navigate(['', 'auth'])
            })
        } else {
            let self = this;
            let body = {
                // Get the JWT that is given from feathers and use this as the author
                author: this.store.getState().user,
                scopeData: JSON.stringify(self.scopeResult)
            }
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
                return self.scopeService.createScope('/scopes', body);
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
}