import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Location } from '../../models/location';

@Component({
  selector: 'change-location-modal',
  templateUrl: 'change-location-modal.html'
})
export class ChangeLocationModal {
    location: string = '';

    constructor(public viewCtrl: ViewController,
                public navParams: NavParams){
        this.location = this.navParams.get('location');
    }

    closeModal() {
        // Send Data back
        this.viewCtrl.dismiss(this.location);
    }
}