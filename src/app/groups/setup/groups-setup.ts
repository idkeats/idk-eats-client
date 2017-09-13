import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AuthService } from '../../auth/auth.service';

import { Friend } from '../../models/friend';

import { LoginPage } from '../../login/login';
import { GroupsQueuePage } from '../queue/queue';

import { ChangeLocationModal } from '../../modals/change-location-modal/change-location-modal';

import * as _ from 'lodash';

@Component({
    selector: 'setup-page',
    templateUrl: 'groups-setup.html'
})
export class GroupsSetupPage {
    myUser: Object;
    friends: Friend[] = [
        {
            name: "Mark Rogers",
            id: 1,
            invited: false,
            picture: 'assets/images/profile-pic.png',
            preferences: [
                {
                    name: "korean",
                    id: 1,
                    display_name: "Korean"
                },
                {
                    name: "thai",
                    id: 4,
                    display_name: "Thai"
                },
                {
                    name: "italian",
                    id: 7,
                    display_name: "Italian"
                },
                {
                    name: "chinese",
                    id: 3,
                    display_name: "Chinese"
                },
                {
                    name: "mexican",
                    id: 2,
                    display_name: "Mexican"
                },
                {
                    name: "american",
                    id: 12,
                    display_name: "American"
                }
            ]
        },
        {
            name: "Pratima Sakinala",
            id: 2,
            invited: false,
            picture: 'assets/images/ps-user.jpg',
            preferences: [
                {
                    name: "korean",
                    id: 5,
                    display_name: "Korean"
                },
                {
                    name: "thai",
                    id: 8,
                    display_name: "Thai"
                },
                {
                    name: "italian",
                    id: 2,
                    display_name: "Italian"
                },
                {
                    name: "chinese",
                    id: 9,
                    display_name: "Chinese"
                },
                {
                    name: "mexican",
                    id: 10,
                    display_name: "Mexican"
                },
                {
                    name: "american",
                    id: 1,
                    display_name: "American"
                }
            ]
        },
        {
            name: "Coby Fielding",
            id: 3,
            invited: false,
            picture: 'assets/images/cf-user.jpg',
            preferences: [
                {
                    name: "Greek",
                    id: 2,
                    display_name: "greek"
                },
                {
                    name: "italian",
                    id: 3,
                    display_name: "Italian"
                },
                {
                    name: "american",
                    id: 1,
                    display_name: "American"
                }
            ]
        },
        {
            name: "Nihar Bheema",
            id: 4,
            invited: false,
            picture: 'assets/images/ns-user.jpg',
            preferences: [
                {
                    name: "indian",
                    id: 3,
                    display_name: "Indian"
                },
                {
                    name: "Greek",
                    id: 2,
                    display_name: "greek"
                },
                {
                    name: "chinese",
                    id: 18,
                    display_name: "Chinese"
                },
                {
                    name: "thai",
                    id: 7,
                    display_name: "Thai"
                }
            ]
        },
        {
            name: "Vitor Perez",
            id: 5,
            invited: false,
            picture: 'assets/images/ryanm-user.jpg',
            preferences: [
                {
                    name: "italian",
                    id: 3,
                    display_name: "Italian"
                },
                {
                    name: "Greek",
                    id: 2,
                    display_name: "greek"
                },
                {
                    name: "american",
                    id: 1,
                    display_name: "American"
                }
            ]
        }
    ];
    friendsCopy: Friend[];
    invitedFriends: Friend[] = [];
    filter: string = '';
    radius: string = '2 miles';
    location: string = '700 Van Ness Ave Fresno, CA 93721';

    constructor(private navController: NavController,
                private authService: AuthService,
                private modalCtrl: ModalController) { }

    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
        this.friendsCopy = this.friends;
    }

    filterFriends(filter: string) {
        let y = filter.replace(/(^\s+|\s+$)/g, "");

        this.friendsCopy = _.sortBy(this.friends.filter(friend => {
            switch (true) {
                case (friend.name || '').toLowerCase().indexOf(y.toLowerCase()) !== -1:
                    return true;
                default:
                    return false;
            }
        }), ['invited', 'asc'], ['name', 'asc']);
    }

    openLocationModal() {
        let changeLocationModal = this.modalCtrl.create(ChangeLocationModal, { location: this.location });

        // catch data sent back from modal
        changeLocationModal.onDidDismiss(data => {
            console.log({ data });
            this.location = data;
        });

        changeLocationModal.present();
    }

    inviteFriend(selectedFriend: Friend) {
        const friend = _.find(this.friends, { id: selectedFriend.id });
        friend.invited = true;

        this.invitedFriends.unshift(friend);
        this.filterFriends(this.filter);
    }

    removeInvite(selectedFriend: Friend) {
        const index = this.invitedFriends.map((friend: Friend) => friend.id).indexOf(selectedFriend.id);

        this.invitedFriends[index].invited = false;
        this.invitedFriends.splice(index, 1);
    }

    startGroup() {
        if (!this.authService.isLoggedIn()) {
            this.navController.push(LoginPage);
        } else {
            this.navController.push(GroupsQueuePage, { friends: this.invitedFriends, location: this.location, roomId: 1 });
        }
    }
}