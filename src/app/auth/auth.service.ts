import { Injectable } from '@angular/core';
import { CrudService } from '../global-services/crud.service';
import { User } from '../models/user';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';

@Injectable()
export class AuthService {
    loggedIn: boolean = false;
    loginError: boolean = false;
    _user = new BehaviorSubject(new User);
    socket: any;

    constructor(private crudService: CrudService) {
        this.socket = io.connect(environment.socketUrl);
        this.socket.on('acceptedRequest', id => {
            this.crudService.get('refresh')
                .then(userData => {
                    this.updateUser(userData.data);
                })
                .catch(err => console.log(err));
        });
    }

    login(creds: any): Promise<any> {
        return this.crudService.post('auth/login', creds)
            .then((res) => {
                if (!res.message) {
                    this.loggedIn = true;
                    localStorage.setItem('auth_token', res.token);
                    const base64Url = res.token.split('.')[1];
                    const base64 = base64Url.replace('-', '+').replace('_', '/');
                    const decode = JSON.parse(window.atob(base64));
                    this._user.next(decode);
                    
                    return this.loginError = false;
                } else {
                    return this.loginError = true;
                }
            });
    }

    logout() {
        this.loggedIn = false;
        localStorage.removeItem('auth_token');
    }

    isLoggedIn() {
        this.loggedIn = localStorage.getItem('auth_token') != null;
        return this.loggedIn;
    }

    updateUser(userData: any) {
        this._user.next(userData);
    }
}