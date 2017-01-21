import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import {Store} from '../store';
import { Observable } from 'rxjs';

declare var CONFIG: any;

@Injectable()

export class ApiService {
    headers: Headers = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('hubspot_token')
    });

    api_url: string = CONFIG.API_URL;

    constructor(private http: Http, private store: Store) { }

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

    get(path: string): Observable<any> {
        // return this.http.get(`${this.api_url}${path}`, { headers: this.headers })
        // this is to be updated when our node proxy server is permanently hosted
        return this.http.get(`${path}`, { headers: this.headers })
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(res => {
                // console.log('ApiService.get res: ', res);
                if(res.status >= 200 && res.status < 300) {
                    // console.log('res.status ok: ', res.status);
                    return res;
                } else {
                  return this.getJson;
                }
            })
    }

    post(path: string, body?: any): Observable<any> {
        return this.http.post(encodeURI(`${path}`), body, { headers: this.headers })
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson)
    }

    update(path: string, id: string,  body?: any): Observable<any> {
        return this.http.put(encodeURI(`${this.api_url}${path}/${id}`), body, { headers: this.headers })
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson)
    }

    delete(path: string): Observable<any> {
        return this.http.delete(
            `${this.api_url}${path}`, { headers: this.headers })
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson)
    }

    setHeaders(headers) {
        Object.keys(headers).forEach(header => this.headers.set(header, headers[header]));
    }
}