import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';

// Pages
import { LoginPage } from '../login/login';
import { MapPage } from '../map/map';

@Component({
    selector: 'history-page',
    templateUrl: 'history.html'
})
export class HistoryPage implements AfterViewInit {
    restaurants: Object[];
    constructor(private navController: NavController,
                private authService: AuthService,
                private http: Http) {}

    ngOnInit() { }

    ngAfterViewInit() {
        this.getJSON()
            .subscribe((data) => {                
                this.restaurants=data.restaurants;
            }, 
            (error) => console.log(error));
    }

    navigateToMap(id: string) {
        if(!this.authService.isLoggedIn()) {
            this.navController.push(LoginPage);
        } else {
            this.navController.push(MapPage, {restaurantId: id});
        }
    }

    private getJSON(): Observable<any> {        
         return this.http.get("assets/restaurant.json")
            .map((res:any) => res.json())
            .catch((error:any) => {
                console.log(error);
                return error;
            });
     }
}