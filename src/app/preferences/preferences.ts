import { Component, ViewChild, ElementRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { SortablejsOptions } from 'angular-sortablejs';
import { PopoverController } from 'ionic-angular';
import { PreferencesPopover } from './preferences-popover/preferences-popover';

import { CrudService } from '../global-services/crud.service';
import { AuthService } from '../auth/auth.service';

import { User } from '../models/user';
import { Preference } from '../models/preference';

@Component({
    selector: 'preferences-page',
    templateUrl: 'preferences.html'
})

export class PreferencesPage {
    @ViewChild('prefSelect', {read: ElementRef}) prefSelect: any;

    constructor(public popoverCtrl: PopoverController, 
                private crudService: CrudService,
                private authService: AuthService) {}

    myUser: User;
    option: string;
    add: boolean = false;
    remove: boolean = false;
    scopedPreferences: Preference[];
    allPreferences: Preference[];
    addedPrefs: Preference[];
    options: SortablejsOptions;
    showPreferenceDropdown: boolean = false;
    preferenceSelected: boolean = false;

    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
        if (this.myUser) {
            this.scopedPreferences = this.myUser.preferences;
            this.getPreferences(this.myUser.id);
            this.options = {
                animation: 150,
                onUpdate: (event: any) => {
                    this.updatePreferenceList({oldIndex: event.oldIndex, newIndex: event.newIndex});
                }
            }
        }
    }

    updatePreferenceList(indexObject: any) {
        this.myUser['preferences'].splice(indexObject.newIndex, 0, this.myUser['preferences'].splice(indexObject.oldIndex, 1)[0]);
        this.scopedPreferences = this.myUser['preferences'].filter(preference => preference);
    }

    presentPopover() {
        let popover = this.popoverCtrl.create(PreferencesPopover);
        popover.present();
        popover.onDidDismiss((option: string) => {
            if (this.option !== option) {
                this.option = option;
            } else {
                this.option = null;
            }
        });
    }

    getPreferences(userId: number) {
        this.crudService.get('preferences')
            .then(preferences => {
                this.allPreferences = this.filterPreferences(preferences, this.myUser.preferences);
            })
            .catch(err => console.log(err));
    }

    addPreferences(preferences: Preference[]) {
        preferences.forEach((preference: Preference) => this.scopedPreferences.push(preference));
        this.preferenceSelected = true;
    }

    savePreferences() {
        if (this.addedPrefs && this.addedPrefs.length) {
            this.crudService.post(`user/${this.myUser.id}/preferences`, {preferences: this.addedPrefs})
                .then(res => {
                    this.updateUserPreference(res.token.data);
                    this.addedPrefs = [];
                    this.showPreferenceDropdown = false;
                })
                .catch(err => console.log(err));
        } else {
            this.showPrefSelect();
        }
        // else if (this.scopedPreferences) {
        //     this.crudService.post(`user/${this.myUser.id}/preferences`, {preferences: this.scopedPreferences})
        //         .then(res => {
        //             this.updateUserPreference(res.token.data);
        //             this.addedPrefs = [];
        //             this.showPreferenceDropdown = false;
        //         })
        //         .catch(err => console.log(err));
        // }
    }

    resetPrefs() {
        if (this.addedPrefs)
            this.scopedPreferences.splice(this.scopedPreferences.length - this.addedPrefs.length, this.addedPrefs.length);
        this.addedPrefs = [];
    }

    filterPreferences(preferenceList: Preference[], existingPreferences: Preference[]) {
        return preferenceList.filter((preference: Preference) => {
            let validator: boolean = true;
            this.myUser.preferences.forEach((userPreference: Preference) => {
                if(preference.id === userPreference.id) {
                    validator = false;
                }
            });
            return validator;
        });
    }

    showPrefSelect() {
        if (!this.showPreferenceDropdown) {
            this.prefSelect.nativeElement.click();
        } else {
            this.resetPrefs();
        }
        this.showPreferenceDropdown = !this.showPreferenceDropdown;
    }

    removePreference(preference) {
        this.crudService.delete('preferences', preference.id)
            .then((res) => {
                this.updateUserPreference(res.token.data);
            });
    }

    updateUserPreference(user) {
        this.myUser = user;
        this.authService.updateUser(this.myUser);
        this.scopedPreferences = this.myUser.preferences;
        this.allPreferences = this.filterPreferences(this.allPreferences, this.scopedPreferences);
    }
}