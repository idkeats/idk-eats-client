import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import 'rxjs';

import { environment } from '../../environments/environment';
@Injectable()

export class CrudService {
    private apiUrl = environment.apiUrl;
    private googleApiKey = environment.googleApiKey;

    headers: Headers;

    constructor(private http: Http) {
      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth_token'));
    }

    post(endPoint: string, body: Object) {
      return this.http
        .post(`${this.apiUrl}${endPoint}`, body, {headers: this.headers})
        .toPromise()
        .then((res: Response) => res.json())
        .catch(res => res.json());
    }

    get(endPoint: string, modifier?: string) {
      let url: string;
      if(modifier) {
        url = `${this.apiUrl}${endPoint}/${modifier}`;
      } else {
        url = `${this.apiUrl}${endPoint}`;
      }
      return this.http
        .get(url, {headers: this.headers, body: ''})
        .toPromise()
        .then((res: Response) => res.json())
        .catch(res => res.json());
    }

    delete(endPoint: string, modifier: any) {
      return this.http
        .delete(`${this.apiUrl}${endPoint}/${modifier}`, {headers: this.headers})
        .toPromise()
        .then((res: Response) => res.json())
        .catch(res => res.json());
    }

    put(endPoint: string, body: Object) {
      return this.http
        .put(`${this.apiUrl}${endPoint}`, body, {headers: this.headers})
        .toPromise()
        .then((res: Response) => res.json())
        .catch(res => res.json());
    }

    getAddressInfo(address: string) {
      return this.http
        .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.googleApiKey}`)
        .toPromise()
        .then((res: Response) => res.json())
        .catch(res => res.json());
    }
}
