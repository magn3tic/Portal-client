import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthService} from './auth.service';
import { Store } from '../store';
import 'rxjs/Rx';

declare var swal: any;

@Injectable()
export class IsSuper implements CanActivate {
    constructor(private store: Store, private router: Router, private authService: AuthService) {}
    
    isSuper() {
        return (this.store.getState().user['role'] === "super" || this.store.getState().user['role'] === "admin") ? true : false;
    }

    canActivate(): boolean {
        const isSuper = this.isSuper();
        if (!isSuper) {
            swal(
                'Not Authorized!',
                'Oh no you don\'t!',
                'error'
            )
            this.router.navigate(['', 'home'])
        }
        return isSuper;
    }
}