import { Component, Output } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'preferences-popover',
    templateUrl: 'preferences-popover.html'
})
export class PreferencesPopover {
    edit: boolean = false;

    constructor(private viewCtrl: ViewController) { }

    editPreferences(option: string) {
        console.log("edit preferences");
        console.log(option);
        this.viewCtrl.dismiss(option);
    }

    close() {
        this.viewCtrl.dismiss();
    }
}