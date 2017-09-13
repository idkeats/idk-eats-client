import { Component, OnInit } from '@angular/core';

import { Friend } from '../../models/friend';
import { User } from '../../models/user';
import { AuthService } from '../../auth/auth.service';
import { CrudService } from '../../global-services/crud.service';
import { environment } from '../../../environments/environment';

import * as _ from 'lodash';
import * as algoliasearch from 'algoliasearch';
import * as io from 'socket.io-client';

@Component({
    selector: 'search',
    templateUrl: 'search.html'
})
export class Search {
    usersCopy: Object[];
    myUser: User;
    users: Array<any>;
    search: any = algoliasearch(environment.algoliaId, environment.algoliaApiKey);
    userSearch: any = this.search.initIndex('users');
    socket: any;

    constructor(private crudService: CrudService,
                private authService: AuthService) {
        this.socket= io.connect(environment.socketUrl);
        this.socket.on('disconnect', () => console.log('Client disconnected from socket'));

        this.socket.on('connect', (socket) => {
            this.socket.emit('joinRoom', 1);
        });
    }

    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
        this.crudService.get('users')
            .then(res => {
                this.users = res.users.filter(user => user.id !== this.myUser.id);
                this.usersCopy = this.users;
            })
            .catch(err => console.log(err));
    }

    filterFriends(filter: string) {
        if(!filter) {
            this.usersCopy = this.users;
        } else {
            let y = filter.replace(/(^\s+|\s+$)/g, "");

            this.usersCopy = _.sortBy(this.users.filter(friend => {
                switch (true) {
                    case (friend.name || '').toLowerCase().indexOf(y.toLowerCase()) !== -1:
                        return true;
                    default:
                        return false;
                }
            }), ['name', 'asc']);
        }
    }

    algoliaSearch(params: string) {
        this.userSearch.search(params, (err, content) => {
            if(err) {
                console.log(err);
            } else {
                this.usersCopy = content.hits;
            }
        });
    }

    requestFriend(user: any) {
        this.crudService.post(`user/${this.myUser.id}/request-friend`, {user_id: user.id})
            .then(res => {
                this.socket.emit('sendRequest', {roomId: 1, requestId: 1, requestFrom: this.myUser, user: user});
            })
            .catch(err => console.log(err));
    }
}