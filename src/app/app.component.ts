import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Subscription } from 'rxjs/Subscription';

import { Location } from './models/location';

import { GeolocationService } from './global-services/geolocation.service';

import { HomePage } from './home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild('nav') public nav: any;
  rootPage:any = HomePage;
  locationSubscription: Subscription;
  currentLocation: Location;

  constructor(platform: Platform, statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              private menuController: MenuController,
              private geolocationService: GeolocationService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
   this.locationSubscription = this.geolocationService.currentLocation
          .subscribe((location: Location) => {
            this.currentLocation = location;
          });
  }

  openPage(componentName: any) {
    this.menuController.close();
    this.nav.setRoot(componentName);
  }

  ngOnDestroy() {
    this.locationSubscription.unsubscribe();
  }
}

