import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../auth/auth.service';

import { HomePage } from '../home/home';
import { RegistrationPage } from '../registration/registration';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  currentPage: string = 'login';
  error: boolean = false;

  constructor(public navCtrl: NavController,
              private authService: AuthService) { 
    if (this.authService.isLoggedIn()) this.navCtrl.push(HomePage);
  }

  ngOnInit() { }
  login(email: string, password: string) {
    const loginObject: Object = {
      email,
      password
    };

    this.authService.login(loginObject)
      .then(res => {
        if (res === true) this.error = true;
        else this.navCtrl.push(HomePage);
      })
      .catch(err => console.log(err));
  }
    navigateTo(page: string) {
    switch(page) {
        case('home'):
            this.navCtrl.push(HomePage);
            break;
        case('register'):
            this.navCtrl.push(RegistrationPage);
            break;
        default:
            this.navCtrl.push(HomePage);
            break;
    }
  }

}

