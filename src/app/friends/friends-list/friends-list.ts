import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { CrudService } from '../../global-services/crud.service';
import { User } from '../../models/user';
import { App } from 'ionic-angular';
import { AuthService } from '../../auth/auth.service';
import { ProfilePage } from '../../profile/profile';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';

@Component({
    selector: 'friends-list',
    templateUrl: 'friends-list.html'
})
export class FriendsList {
    myUser: User;
    friends: Array<any> = [];
    socket: any;
    
    constructor(private crudService: CrudService,
                private app: App,
                private authService: AuthService,
                private navController: NavController) {
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
        // if (this.myUser && this.myUser.friends) this.friends = this.getFriends(this.myUser.friends);
    }

    // getFriends(friends: any) {
    //     const friendArray: User[] = [];
    //     friends.forEach((friend) => {
    //         this.crudService.get(`user/${friend.friend_id}`)
    //             .then((res) => {
    //                 friendArray.push(res.user);
    //             });
    //     });
    //     return friendArray;
    // }

    removeFriend(friend: any) {
        this.crudService.delete('user', friend.id)
            .then(updatedUser => {
                this.myUser.friends = this.myUser.friends.filter((deletedFriend: User) => friend.id !== deletedFriend.id)
                this.authService.updateUser(updatedUser.token.data);
            })
            .catch(err => console.log(err));
    }

    goToProfile(friend: any) {
        this.app.getRootNav().push(ProfilePage, {userId: friend.id});
    }
    navigateTabs(tabNumber: number) {
        if(this.navController.parent) {
            this.navController.parent.select(tabNumber);
        }
    }
}