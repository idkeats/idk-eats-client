import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../auth/auth.service';

import { LoginPage } from '../../login/login';
import { GroupsSetupPage } from '../setup/groups-setup';

@Component({
    selector: 'groups-history-page',
    templateUrl: 'groups-history.html'
})
export class GroupsHistoryPage {

    myUser: Object;
    groups: Object[];

    constructor(private navController: NavController,
                private authService: AuthService) { }

    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
        this.groups = [
            {
                restaurant: 'Kikkus',
                date: 'July 7th, 2017'
            },
            {
                name: 'Fab 5',
                restaurant: 'Taco Truck',
                date: 'June 10th, 2017'
            },
            {
                restaurant: 'Take 3',
                date: 'July 10th, 2017'
            },
            {
                restaurant: 'Kikkus',
                date: 'July 7th, 2017'
            },
            {
                name: 'Captain Planets Lame Ass Sidedkicks',
                restaurant: 'Taco Truck',
                date: 'June 10th, 2017'
            },
            {
                restaurant: 'Take 3',
                date: 'July 10th, 2017'
            }
        ]
    }

    createNewGroup() {
        if(!this.authService.isLoggedIn()) {
            this.navController.push(LoginPage);
        } else {
            this.navController.push(GroupsSetupPage);
        }
    }
}