import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ViewController, NavController } from 'ionic-angular';

import { AuthService } from '../auth/auth.service';

import { LoginPage } from '../login/login';
import { RegistrationPage } from '../registration/registration';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { ProfilePage } from '../profile/profile';
import { HistoryPage } from '../history/history';
import { GroupsHistoryPage } from '../groups/history/groups-history';
import { GroupsSetupPage } from '../groups/setup/groups-setup';
import { SettingsPage } from '../settings/settings';
import { PreferencesPage } from '../preferences/preferences';
import { FriendsPage } from '../friends/friends';

@Component({
  selector: 'app-nav',
  templateUrl: 'nav.html'
})
export class Nav {
  @Input() page: string;
  
  subnavActive: Boolean = false;
  isLoggedIn: Boolean = false;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private authService: AuthService) {
    this.navCtrl = navCtrl;
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  presentModal() {
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

  navigateTo(page: string) {
    if(!this.authService.isLoggedIn()) {
      this.navCtrl.push(LoginPage);
    } else {
      switch(page) {
        case('home'):
            this.navCtrl.push(HomePage);
            break;
        case('login'):
            this.navCtrl.push(LoginPage);
            break;
        case('register'):
            this.navCtrl.push(RegistrationPage);
            break;
        case('map'):
            this.navCtrl.push(MapPage);
            break;
        case('preferences'):
            this.navCtrl.push(PreferencesPage);
            break;
        case('profile'):
            this.navCtrl.push(ProfilePage);
            break;
        case('history'):
            this.navCtrl.push(HistoryPage);
            break;
        case('group'):
            this.navCtrl.push(GroupsSetupPage);
            break;
        case('groups'):
            this.navCtrl.push(GroupsHistoryPage);
            break;
        case('friends'):
            this.navCtrl.push(FriendsPage);
            break;
        default:
            this.navCtrl.push(HomePage);
            break;
      }
    }
    this.subnavActive = false;
  }

  logout() {
    this.authService.logout();
    this.navCtrl.push(LoginPage);
  }
}
