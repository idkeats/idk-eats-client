import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Slides } from 'ionic-angular';

import { CrudService } from '../global-services/crud.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html'
})
export class RegistrationPage {
    @ViewChild(Slides) slides: Slides;
    @ViewChild('scrollRef', { read: ElementRef }) scrollRef: any;

    user: object = {};
    myUser: any;
    passwordConfirm: boolean = false;
    error: boolean = false;
    allPreferences: any;
    userPreferences: any = [];

    constructor(private crudService: CrudService,
        private authService: AuthService) { }

    ngOnInit() {
        this.getPreferences();
        this.slides.lockSwipeToNext(true);
    }

    register() {
        const userObject: object = {
            name: this.user['name'],
            email: this.user['email'],
            zip: this.user['zip'],
            password: this.user['password'],
            password_confirmation: this.user['passwordConfirm']
        }
        this.crudService.post('register', userObject)
            .then(res => {
                const creds: object = {
                    email: this.user['email'],
                    password: this.user['password']
                }
                this.authService.login(creds)
                    .then(res => {
                        if (res === true) this.error = true;
                        else {
                            this.crudService.get('refresh')
                                .then(res => {
                                    this.myUser = res.data;
                                    this.slides.lockSwipeToNext(false);
                                    this.scrollRef.nativeElement.querySelector('.swiper-container').scrollTop = 0;
                                    this.slides.slideNext();
                                })
                                .catch(err => console.log(err));
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }

    getPreferences() {
        this.crudService.get('preferences')
            .then(preferences => {
                this.allPreferences = preferences;
            })
            .catch(err => console.log(err));
    }

    savePreferences(preferences: Object[]) {
        this.crudService.post(`user/${this.myUser.id}/preferences`, { preferences: preferences })
            .then(res => {
                this.myUser = res.token.data;
                this.authService.updateUser(this.myUser);
            })
            .catch(err => console.log(err));
    }
}
