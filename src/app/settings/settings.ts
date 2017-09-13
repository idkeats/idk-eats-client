import { Component } from '@angular/core';

import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
    constructor(public viewCtrl: ViewController) { }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}