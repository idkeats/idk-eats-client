import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Location } from '../models/location';
import { environment } from '../../environments/environment';

@Injectable()

export class GeolocationService {
    locationSubscription: Subscription;
    private _location = new BehaviorSubject<Location>(new Location);
    currentLocation = this._location.asObservable();
    googleApiUrl: string = 'https://maps.googleapis.com/maps/api'; // For prod

    constructor(private geolocation: Geolocation,
        private http: Http) {
        this.locationSubscription = this.geolocation.watchPosition()
            .subscribe((position: any) => {
                if (!position.code) {
                    let url = `${environment.googleApiUrl}/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}` +
                        `&key=${environment.googleApiKey}`;

                    this.http
                        .get(url)
                        .toPromise()
                        .then((res: any) => {
                            let location = res.json().results[0].formatted_address.toLowerCase().split(', ').join(' ');

                            const locationObject: Location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                speed: position.coords.speed,
                                altitude: position.coords.altitude,
                                location: location
                            };

                            this._location.next(locationObject);
                        });
                } else {
                    this._location.next({
                        latitude: 36.7320618,
                        longitude: -119.7879437,
                        speed: 0,
                        altitude: 0,
                        location: "700 Van Ness Ave Fresno, CA 93721"
                    })
                }
            });
    }

    public getDistanceBetweenPoints(start, end, units) {
        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;
    }

    private toRad(x) {
        return x * Math.PI / 180;
    }

    ngOnDestroy() {
        this.locationSubscription.unsubscribe();
    }
}
