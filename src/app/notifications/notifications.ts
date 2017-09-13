import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

import { User } from '../models/user';

import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'notifications',
    templateUrl: '/notifications.html'
})
export class Notifications {
    myUser: User;
    constructor(public viewCtrl: ViewController,
                private authService: AuthService) { }

    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
        this.myUser.notifications = [
            {
                image: '../assets/images/rm-user.jpg',
                name: 'Rob',
                message: 'invited you to join his group',
                date: '8/16/17'
            }
        ]
    }
    
    dismiss() {
        this.viewCtrl.dismiss();
    }
}