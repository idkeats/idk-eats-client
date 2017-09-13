import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { CrudService } from '../../global-services/crud.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'suggestions',
    templateUrl: 'suggestions.html'
})
export class Suggestions {
    myUser: User;
    users: Array<any> = [
        {
            name: 'Ryan',
            pic: './assets/images/ryanm-user.jpg'
        },
        {
            name: 'Michael',
            pic: './assets/images/ryanm-user.jpg'
        },
        {
            name: 'Mark',
            pic: './assets/images/ryanm-user.jpg'
        },
        {
            name: 'Pratima',
            pic: './assets/images/ryanm-user.jpg'
        }
    ];

    constructor(private crudService: CrudService,
                private authService: AuthService) {}

    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
    }

    requestFriend(user: any) {
        console.log(`${user.name} would never be your friend.`)
        // this.crudService.put(`someurl`, {body})
        //     .then(requestStatus => {
        //         do some stuff
        //     })
        //     .catch(err => console.log(err));
    }
}