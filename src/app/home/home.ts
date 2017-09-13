import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../auth/auth.service';
import { CrudService } from '../global-services/crud.service';

import { LoginPage } from '../login/login';
import { RegistrationPage } from '../registration/registration';
import { PreferencesPage } from '../preferences/preferences';
import { environment } from '../../environments/environment';

import * as moment from 'moment';
import * as algoliasearch from 'algoliasearch';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myUser: Object;
  showFeed: boolean = true;
  showToggleButton: boolean = false;

  constructor(public navCtrl: NavController,
              private authService: AuthService,
              private crudService: CrudService) {
    this.navCtrl = navCtrl;
  }

  ionViewDidLoad() {
    if(!this.authService._user.getValue().name && this.authService.isLoggedIn()) {
      this.crudService.get('refresh')
          .then(response => {
            this.authService.updateUser(response.data);
            this.myUser = response.data;
            this.getUserData();
            this.showToggleButton = true;
          })
          .catch(err => {
            // Token is either bad or expired
            this.authService.logout();
            this.navCtrl.push(LoginPage);
          });
    } else if(!this.authService.isLoggedIn()) {
      this.showFeed = false;
      this.myUser = {};
    } else if(this.authService._user.getValue()) {
      this.myUser = this.authService._user.getValue();
      this.getUserData();
      this.showToggleButton = true;
    }
  }

  getUserData() {
    this.myUser['feed'] = [
      {
        id: 1,
        user: {
          picture: './assets/images/rm-user.jpg',
          name: 'Ryan',
          dateStamp: 'July 5, 2017'
        },
        post: {
          picture: './assets/images/ns-user.jpg',
          postMessage: 'Hey guys! We took a chance and used IDK Eats for our anniversory dinner... it was AWESOME! Great time, even better food. What is your favorite IDK Eats experience?',
          ageOfPost: this.getPostAge('July 5, 2017'),
          likes: 12,
          comments: 4,
          liked: false
        }
      },
      {
        id: 1,
        user: {
          picture: './assets/images/mw-user.jpg',
          name: 'Micheal',
          dateStamp: 'July 4, 2017'
        },
        post: {
          picture: './assets/images/frosty-queen.png',
          userTag: 'Micheal Wallert',
          nameTags: ['Mark Rogers'],
          postMessage: ' just checked in at',
          location: 'Frosty Queen',
          ageOfPost: this.getPostAge('July 4, 2017'),
          likes: 2,
          comments: 6,
          liked: true
        }
      }
    ];
  }

  navigateTo(page: string) {
    switch(page) {
        case('preferences'):
            this.navCtrl.push(PreferencesPage);
            break;
        case('login'):
            this.navCtrl.push(LoginPage);
            break;
        case('register'):
            this.navCtrl.push(RegistrationPage);
            break;
        default:
            this.navCtrl.push(HomePage);
            break;
    }
  }

  getPostAge(originalDate: string) {
    const currentDate: any = moment();
    const timeDiff: any = currentDate.from(moment(new Date(originalDate)), true);

    return timeDiff;
  }

  likePost(post: any) {
    if(post.liked) {
      post.likes -= 1;
      post.liked = false;
    } else {
      post.likes += 1;
      post.liked = true;
    }
  }
}