import { Component } from '@angular/core';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';

import { CrudService } from '../../global-services/crud.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';

@Component({
    selector: 'requests',
    templateUrl: 'requests.html'
})
export class Requests {
    myUser: User;
    userSub: Subscription;
    socket: any;
    requests: any;

    constructor(private crudService: CrudService,
                private authService: AuthService) {
        this.socket= io.connect(environment.socketUrl);
        this.socket.on('connect', () => this.socket.emit('joinRoom', 1));

        this.socket.on('updateRequests', (requestId: number, requestFrom: User, user: User) => {

            if (this.myUser.id == user.id) {
                this.myUser.my_friend_requests.push({
                    owner: {
                        name: requestFrom.name,
                        id: requestFrom.id,
                        pic: requestFrom.pic
                    },
                    id: requestId
                });
            }
        });

        this.socket.on('acceptedRequest', id => {
            this.crudService.get('refresh')
                .then(userData => {
                    this.myUser = userData.data;
                    this.authService.updateUser(userData.data);
                })
                .catch(err => console.log(err));
        });
    }

    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
    }

    declineRequest(requestId: number) {
        this.crudService.delete(`friend-request`, requestId)
            .then(response => {
                this.myUser.my_friend_requests = this.myUser.my_friend_requests.filter(request => request.id !== requestId);
            })
            .catch(err => console.log(err));
    }

    acceptRequest(friendRequest: any) {
        this.crudService.post(`user/${this.myUser.id}/add-friend`, {friend_id: friendRequest.owner.id})
            .then((updatedUser: any) => {
                this.socket.emit('accepted', friendRequest.owner.id);
                this.myUser = updatedUser[0].data;
                this.authService.updateUser(this.myUser);
            })
            .catch(err => console.log(err));
    }
}