import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'veto-exceeded-modal',
  templateUrl: 'veto-exceeded-modal.html'
})
export class VetoExceededModal {
  constructor(public viewCtrl: ViewController) {}

  closeModal() {
    this.viewCtrl.dismiss();
    // Send Data back
    // this.viewCtrl.dismiss(userProvidedData);
  }
}