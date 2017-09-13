import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavParams, ModalController, Content } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Location } from '../../models/location';
import { Friend } from '../../models/friend';
import { GeolocationService } from '../../global-services/geolocation.service';
import { AuthService } from '../../auth/auth.service';
import { CrudService } from '../../global-services/crud.service';
import { ChatModal } from '../../modals/chat-modal/chat-modal';
import { VetoExceededModal } from '../../modals/veto-exceeded-modal/veto-exceeded-modal';
import * as io from 'socket.io-client';
import { MapsAPILoader } from '@agm/core';
declare const google: any;
@Component({
    selector: 'queue-page',
    templateUrl: 'queue.html',
    viewProviders: [Content]
})
export class GroupsQueuePage {
    myUser: Object;
    invitedFriends: Friend[];
    location: any;
    locationSubscription: Subscription;
    currentLocation: Location;
    map: any;
    zoom: number = 15;
    queueStarted: Boolean = false;
    selectedRestaurant: any = null;
    rating: number = 0;
    googleApiUrl: string = 'https://maps.googleapis.com/maps/api'; // for real application use https://maps.googleapis.com/maps/api
    preferences: any;
    currentIndex: number = 0;
    searchStr: string;
    altRestaurants: Array<Object> = [];
    altRestaurantIndex: number = 0;
    voteCount: number = 0;
    downvoteCount: number = 0;
    phone_number: string;
    info: string = "general";
    photos: Array<any> = [];
    morePictures: boolean = false;
    openVetoModal: boolean = false;
    roomId: number;
    socket: any;
    mapLocation: any;
    @ViewChild('map', {read: ElementRef}) mapRef: any;
    geoCoder: any;
    currentAddress: any;
    placesService: any;
    constructor(private navParams: NavParams,
        private geolocationService: GeolocationService,
        private crudService: CrudService,
        private http: Http,
        private modalCtrl: ModalController,
        private authService: AuthService,
        private googleLoader: MapsAPILoader) { }
    ionViewDidEnter() {
        this.myUser = this.authService._user.getValue();
        this.myUser['picture'] = 'assets/images/mw-user.jpg';
        this.invitedFriends = this.navParams.get('friends');
        this.location = this.navParams.get('location');
        this.roomId = this.navParams.get('roomId');
        this.locationSubscription = this.geolocationService.currentLocation
            .subscribe((location: Location) => {
                this.currentLocation = location;
                
                if (this.currentLocation.location) {
                    // let url = `${this.googleApiUrl}/geocode/json?address=` +
                    //     `${this.location}&key=${environment.googleApiKey}`;
                    // this.http.get(url)
                    //     .toPromise()
                    //     .then((res) => {
                    //         this.location = res.json().results[0];
                    //         this.startProcess();
                    //     });
                    this.googleLoader.load()
                        .then(() => {
                            const latLng: any = {
                                lat: this.currentLocation.latitude,
                                lng: this.currentLocation.longitude
                            };
                            this.mapLocation = new google.maps.LatLng(latLng.lat, latLng.lng);
                            const map: any = new google.maps.Map(this.mapRef.nativeElement, {
                                center: this.mapLocation,
                                zoom: 15
                            });
                            this.geoCoder = new google.maps.Geocoder;
                            // this.geoCoder.geocode({'location': latLng}, (results, status) => {
                            //   if(status === google.maps.GeocoderStatus.OK && results[0]) {
                            //     this.currentAddress = results[0].formatted_address;
                            //     console.log(this.currentAddress);
                            //   }
                            // });
                            this.placesService = new google.maps.places.PlacesService(map);
                             this.startProcess();
                        });
                } else {
                    this.startProcess();
                }
                // TODO: Remove before pushing
                // this.currentLocation.location = '700 Van Ness Fresno CA 93721';
                // this.currentLocation.latitude = 36.7477;
                // this.currentLocation.longitude = -119.7724;
            });
        
        // this.socket = io.connect(environment.socketUrl);
        // this.socket.on('connect', () => console.log('Client connection successful'));
        // this.socket.emit('joinRoom', this.roomId);
        // this.socket.on('disconnect', () => console.log('Client disconnected from socket'));
    }
    private startProcess() {
        if (!this.altRestaurants.length && !this.openVetoModal) {
            this.preferences = this.runAlgorithm();
            this.currentIndex = 0;
            this.searchStr = this.preferences[0].name;
            this.altRestaurants.push({
                preference_name: this.searchStr,
                restaurants: [],
                count: 0
            });
            this.pickRestaurant();
        }
    }
    private runAlgorithm() {
        let cuisines = [];
        this.myUser['preferences'].forEach((preference, index) => {
            cuisines.push({
                name: preference.name,
                points: (this.myUser['preferences'].length - index),
                count: 1,
            });
        });
        this.invitedFriends.forEach((friend) => {
            friend.preferences.forEach((preference, i) => {
                _.merge(preference, { points: friend.preferences.length - i });
                let cuisine = _.find(cuisines, { name: preference['name'] });
                if (cuisine) {
                    _.merge(cuisine, {
                        count: cuisine.count + 1,
                        points: cuisine['points'] + preference['points']
                    });
                } else {
                    let newCuisine = {
                        name: preference['name'],
                        count: 1,
                        points: preference['points']
                    }
                    cuisines.push(newCuisine);
                }
            });
        });
        return this.sortCuisines(cuisines);
    }
    private sortCuisines(cuisines) {
        return cuisines.sort((cuisineA, cuisineB) => cuisineB.points - cuisineA.points);
    }
    private pickRestaurant() {
        if (this.searchStr) {
            this.getRestaurantsFromText(this.searchStr);
        }
    }
    private getRestaurantsFromText(searchFor) {
        let str = '';
        // console.log('location', this.location);
        // console.log('current location', this.currentLocation);
        // if (this.location && this.location.formatted_address !== this.currentLocation.location) {
        //     str = (searchFor + ' restaurant ' + this.location.formatted_address.split(', ').join(' ')).split(' ').join('+');
        // } else {
            str = (searchFor + ' restaurant ' + this.currentLocation.location).split(' ').join('+');
        // }
        // let url = `${this.googleApiUrl}/place/textsearch/json?query=${str}` +
        //     `&key=${environment.googleApiKey}`;
        // return this.http.get(url)
        //     .map((res) => res.json())
        //     .catch((error: any) => {
        //         console.log(error);
        //         return error;
        //     });
        let request = {
            location: this.mapLocation,
            radius: '5000',
            query: str
        };
        this.placesService.textSearch(request, (results, status, pagination) => {
            if(status == google.maps.places.PlacesServiceStatus.OK) {
                // results.forEach(result => {
                //   console.log("Restaurant name: ", result.name);
                //   console.log("Restaurant address: ", result.formatted_address);
                //   console.log("Full object: ", result);
                // });
                if (pagination.nextPage) this.selectRestaurant({results, pagination});
                else this.selectRestaurant({results});
                }
                // console.log({pagination});
                // if(pagination.hasNextPage) {
                // setTimeout(() => {
                //     pagination.nextPage();
                // }, 2000);
                // }
        });
    }
    private selectRestaurant(data) {
        let restaurants = this.getDistance(data.results),
            list = _.find(this.altRestaurants, { preference_name: this.searchStr });
                
        restaurants = this.sortByDistanceRating(restaurants);
        for (let rest of restaurants) {
            if (rest.opening_hours && rest.opening_hours.open_now) {
                if (!this.selectedRestaurant) {
                    this.altRestaurantIndex = this.altRestaurants.map((x: any) => x.preference_name).indexOf(list.preference_name);
                    this.photos = [];
                    this.selectedRestaurant = rest;
                    if (this.selectedRestaurant && this.selectedRestaurant.rating){
                        this.rating = this.selectedRestaurant.rating * 20;
                    }
                    this.getPlaceDetails();
                } else if (this.selectedRestaurant.id) {
                    if (list.count < 5) {
                        list.restaurants.push(rest);
                        list.count = list.count + 1;
                        list.restaurants = this.sortByDistanceRating(list.restaurants);
                    }
                    else {
                        this.searchStr = '';
                        break;
                    }
                }
            }
        }
        if (!this.selectedRestaurant || list.count < 5) {
            // this.getNextRestaurants(data.next_page_token);
             if(data.pagination.hasNextPage) {
                setTimeout(() => {
                    data.pagination.nextPage();
                }, 2000);
             }
        } else {            
            if (this.altRestaurants.length < 5) {
                let maxAltRestCount = Math.min(this.preferences.length, 5);
                if (this.currentIndex < maxAltRestCount) {
                    this.currentIndex += 1;
                    this.searchStr = this.preferences[this.currentIndex].name;
                    this.altRestaurants.push({
                        preference_name: this.searchStr,
                        restaurants: [],
                        count: 0
                    });
                } else {
                    this.searchStr = this.preferences[0].name;
                }
                this.pickRestaurant();
            }
        }
    }
    private getDistance(restaurants) {
        restaurants.map((restaurant) => {
            let usersLocation = {
                lat: this.currentLocation.latitude,
                lng: this.currentLocation.longitude
            },
                placeLocation = {
                    lat: restaurant.geometry.location.lat(),
                    lng: restaurant.geometry.location.lng()
                };
            restaurant.distance = this.geolocationService.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'miles'
            ).toFixed(2);
        });
        return restaurants;
    }
    private sortByDistanceRating(restaurants) {
        return _.orderBy(restaurants, ['distance', 'rating'], ['desc', 'desc']);
    }
    private getPlaceDetails() {
        // if (this.selectedRestaurant && this.selectedRestaurant.place_id) {
        //     let url = `${this.googleApiUrl}/place/details/json?placeid=` +
        //         `${this.selectedRestaurant.place_id}&key=${environment.googleApiKey}`;
        //     this.http.get(url)
        //         .toPromise()
        //         .then((res) => {
        //             _.merge(this.selectedRestaurant, res.json().result);
        //             this.getPhotos(this.selectedRestaurant.photos);
        //             // TODO: Feature: call on click on phone number
        //             // if (this.selectedRestaurant.formatted_phone_number)
        //             //     (<HTMLElement>document.getElementById('phone-number')).href = `tel:${this.selectedRestaurant.formatted_phone_number}`;
        //         });
        // }
        let request = {
            placeId: this.selectedRestaurant.place_id
        };
        this.placesService.getDetails(request, (results, status) => {
            if(status == google.maps.places.PlacesServiceStatus.OK) {
                // results.forEach(result => {
                //   console.log("Restaurant name: ", result.name);
                //   console.log("Restaurant address: ", result.formatted_address);
                //   console.log("Full object: ", result);
                // });
                _.merge(this.selectedRestaurant, results);
                this.getPhotos(this.selectedRestaurant.photos);
            }
        });
    }
    public getPhotos(photos) {
        if (photos) {
            let maxCount = Math.min(photos.length, 5);
            if (photos.length > maxCount) this.morePictures = true;
            else this.morePictures = false;
            
            photos.forEach((photo, index) => {
                if (index < maxCount) {
                    // let url = `${this.googleApiUrl}/place/photo?maxwidth=400&photoreference=` + 
                    //     `${photo.photo_reference}&key=${environment.googleApiKey}`;
                    this.photos.push({url: photo.getUrl({'maxWidth': 400})});
                    // this.http.get(url)
                    //     .toPromise()
                    //     .then((res) => {
                    //         if (res.status == 200) {
                    //             this.photos.push(res);
                    //         }
                    //     });
                }
            });
        }
    }
    private getNextRestaurants(token) {
        // let url = `${this.googleApiUrl}/place/textsearch/json?pagetoken=` +
        //     `${token}&key=${environment.googleApiKey}`;
        // this.http.get(url)
        //     .toPromise()
        //     .then((res) => {
        //         this.selectRestaurant(res.json());
        //     });
    }
    saveMapInstance(map: any) {
        this.map = map;
    }
    public startQueue() {
        this.queueStarted = true;
        if (this.selectedRestaurant) {
            this.crudService.getAddressInfo(this.selectedRestaurant.formatted_address)
                .then(res => {
                    this.selectedRestaurant.latitude = res.results[0].geometry.location.lat;
                    this.selectedRestaurant.longitude = res.results[0].geometry.location.lng;
                })
                .catch(err => console.log(err));
        }
    }
    public getDirections(address: string) {
        window.open(`https://www.google.com/maps/dir/My+Location/${address}`, '_system');
    }
    public dislikeSelection() {
        this.downvoteCount += 1;
        if (this.downvoteCount > (this.invitedFriends.length + 1) / 2 && this.altRestaurants.length) {
            this.downvoteCount = 0;
            
            if (this.altRestaurantIndex < this.altRestaurants.length - 1)
                this.altRestaurantIndex += 1;
            else this.altRestaurantIndex = 0;
            this.photos = [];
            this.selectedRestaurant = this.altRestaurants[this.altRestaurantIndex]['restaurants'][0];
            this.getPlaceDetails();
            this.cleanUpAltRestaurants();
            if (this.selectedRestaurant && this.selectedRestaurant.rating){
                this.rating = this.selectedRestaurant.rating * 20;
            }
            if(this.selectedRestaurant && this.selectedRestaurant.formatted_address) {
                this.crudService.getAddressInfo(this.selectedRestaurant.formatted_address)
                    .then(res => {
                        this.selectedRestaurant.latitude = res.results[0].geometry.location.lat;
                        this.selectedRestaurant.longitude = res.results[0].geometry.location.lng;
                    })
                    .catch(err => console.log(err));
            }
        } else if (!this.altRestaurants.length) {
            this.openVetoModal = true;
            let vetoModal = this.modalCtrl.create(VetoExceededModal);
            vetoModal.onDidDismiss(data => {
                console.log({ data });
            });
            vetoModal.present();
        }
    }
    private cleanUpAltRestaurants() {
        this.altRestaurants[this.altRestaurantIndex]['restaurants'].shift();
        this.altRestaurants[this.altRestaurantIndex]['count'] -= 1;
        if (this.altRestaurants[this.altRestaurantIndex]['restaurants'].length == 0)
            this.altRestaurants.splice(this.altRestaurantIndex, 1);
    }
    public likeSelection() {
        this.voteCount += 1;
    }
    public openChat() {
        let chatModal = this.modalCtrl.create(ChatModal, { myUser: this.myUser, invitedFriends: this.invitedFriends, roomId: this.roomId});
        // catch data sent back from modal
        chatModal.onDidDismiss(data => {
            console.log({ data });
        });
        chatModal.present();
    }
    public getMorePictures(infiniteScroll) {
        
        setTimeout(() => {
            console.log('display more images');
        }, 2000);
    }
    ngOnDestroy() {
        this.locationSubscription.unsubscribe();
    }
}