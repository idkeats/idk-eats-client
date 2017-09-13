import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ViewController, NavController, NavParams } from 'ionic-angular';
import { CrudService } from '../global-services/crud.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user';

import { SettingsPage } from '../settings/settings';
import { PreferencesPage } from '../preferences/preferences';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  subnavActive: Boolean = false;
  myUser: User;
  currentUser: User;
  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private params: NavParams,
              private crudService: CrudService,
              private authService: AuthService) {
    this.navCtrl = navCtrl;
  }

  ionViewDidEnter() {
    this.myUser = this.authService._user.getValue();
    this.myUser.pic = './assets/images/rm-user.jpg';
    if(this.params.data['userId']) {
      this.crudService.get(`user/${this.params.data['userId']}`)
        .then(userData => {
          this.currentUser = userData.user;
          this.currentUser.pic = './assets/images/mw-user.jpg';
        });
    } else {
      this.currentUser = this.myUser;
    }
  }
  
  presentModal() {
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

  navigateToPreferences() {
    this.navCtrl.push(PreferencesPage);
  }

  post() {
    console.log('post');
  }
  
}