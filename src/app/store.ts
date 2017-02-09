import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

export interface State {
    isLoading: Boolean;
    user: Object;
    scope: Object;
    scopes: Array<Object>;
    activeScope: Object;
    clients: Array<any>;
    activeClient: Object;
    deals: Array<any>;
    activeCompany: Object;
    companies: Array<any>;
}

const defaultState: State = {
    isLoading: false,
    user: {
        loggedIn: false,
        tokens: {},
        data: {}
    },
    scope: {},
    scopes: [],
    activeScope: {},
    clients: [],
    activeClient: {},
    deals: [],
    activeCompany: {},
    companies: []
}

const _store = new BehaviorSubject<State>(defaultState);

@Injectable()
export class Store {
    private _store = _store;
    changes = this._store
    .asObservable()
    .distinctUntilChanged()
    .do(changes => console.log('changes'));

    setState(state: State) {
        console.log('state set: ', state);
        this._store.next(state);
    }

    getState(): State {
        return this._store.value;
    }

    purge() {
        this._store.next(defaultState);
    }
}