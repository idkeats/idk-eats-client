import { Component, Output, OnInit } from '@angular/core';
import { NavController, Navbar, ModalController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { Notifications } from '../notifications/notifications';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.html'
})
export class Header implements OnInit {
  subnavActive: Boolean = false;
  showBackButton: boolean = false;

  constructor(public navCtrl: NavController,
              private authService: AuthService,
              private modalCtrl: ModalController) {
    this.navCtrl = navCtrl;
  }

  ngOnInit(){
      this.showBackButton = this.navCtrl.canGoBack();
      if(this.navCtrl.getPrevious() && this.navCtrl.getPrevious().name === 'LoginPage') this.showBackButton = false;
  }

  getItems(event: any) {
      console.log(event);
  }
  navigateTo(page: string) {
    if(!this.authService.isLoggedIn()) {
      this.navCtrl.push(LoginPage);
    } else if(this.navCtrl.getActive().component.name.toLowerCase().replace('page','') === page) {
      return;
    } else {
      switch(page) {
        case('home'):
            this.navCtrl.push(HomePage);
            break;
        case('login'):
            this.navCtrl.push(LoginPage);
            break;
        default:
            this.navCtrl.push(HomePage);
            break;
      }
    }
    this.subnavActive = false;
  }

  showNotifications() {
    let modal = this.modalCtrl.create(Notifications);
    modal.present();
  }

  goBack() {
    if(!this.authService.isLoggedIn()) {
        this.navCtrl.push(LoginPage);
    } else this.navCtrl.pop();
  }
  
}
