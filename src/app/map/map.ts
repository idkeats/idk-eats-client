import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Location } from '../models/location';
import { MapsAPILoader } from '@agm/core';
import { Subscription } from 'rxjs/Subscription';
import { GeolocationService } from '../global-services/geolocation.service';
import { AuthService } from '../auth/auth.service';
import { CrudService } from '../global-services/crud.service';
import { environment } from '../../environments/environment';
declare const google: any;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  myUser: Object;
  locationSubscription: Subscription;
  currentLocation: Location;
  zoom: number = 15;
  map: any;
  restaurantId: string;
  restaurants: any;
  displayRestInfo: boolean = false;
  displayRest: any;
  search: boolean = false;
  searchFor: string;
  moreRestaurantsToken: string = '';
  googleApiUrl: string = 'http://localhost:8100/api'; // for real application use https://maps.googleapis.com/maps/api
  mapLocation: any;
  @ViewChild('map', {read: ElementRef}) mapRef: any;
  geoCoder: any;
  currentAddress: any;
  placesService: any;
  constructor(private params: NavParams,
              private geolocationService: GeolocationService,
              private crudService: CrudService,
              private http: Http,
              private authService: AuthService,
              private googleLoader: MapsAPILoader) {
    if (params.get('restaurantId')) this.restaurantId = params.get('restaurantId');
  }
  ionViewDidEnter() {
    this.myUser = this.authService._user.getValue();
    this.locationSubscription = this.geolocationService.currentLocation
      .subscribe((location: Location) => {
        this.currentLocation = location;
        console.log({location});
        this.googleLoader.load()
          .then(() => {
            const latLng: any = {
              lat: this.currentLocation.latitude,
              lng: this.currentLocation.longitude
            };
            this.mapLocation = new google.maps.LatLng(latLng.lat, latLng.lng);
            console.log(this.mapLocation);
            const map: any = new google.maps.Map(this.mapRef.nativeElement, {
              center: this.mapLocation,
              zoom: 15
            });
            console.log(map);
            // this.geoCoder = new google.maps.Geocoder;
            // this.geoCoder.geocode({'location': latLng}, (results, status) => {
            //   if(status === google.maps.GeocoderStatus.OK && results[0]) {
            //     this.currentAddress = results[0].formatted_address;
            //     console.log(this.currentAddress);
            //   }
            // });
            console.log(google.maps.places.PlacesService);
            
            this.placesService = new google.maps.places.PlacesService(map);
            this.getAllRestaurants();
          });
      });
  }
  public saveMapInstance(map: any) {
    this.map = map;
  }
  private getAllRestaurants() {
    let request = {
        location: this.mapLocation,
        radius: '5000',
        query: 'restaurant near ' + this.currentLocation.location
      };
      
      this.placesService.textSearch(request, (results, status, pagination) => {
        if(status == google.maps.places.PlacesServiceStatus.OK) {
          this.filterRestaurants(results, false);
          // results.forEach(result => {
          //   console.log("Restaurant name: ", result.name);
          //   console.log("Restaurant address: ", result.formatted_address);
          //   console.log("Full object: ", result);
          // });
        }

        if(pagination.hasNextPage) {
          setTimeout(() => {
            pagination.nextPage();
          }, 2000);
        }
      });
  }
  // private getJSON(): Observable<any> {
  //   let url = `${this.googleApiUrl}/place/nearbysearch/json?` +
  //     `location=${this.currentLocation.latitude},${this.currentLocation.longitude}` +
  //     `&radius=5000&type=restaurant&keyword=any` +
  //     `&key=${environment.googleApiKey}`;
  //   return this.http.get(url)
  //     .map((res: any) => {
  //       if (res.json().next_page_token) this.moreRestaurantsToken = res.json().next_page_token;
  //       return res.json();
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //       return error;
  //     });
      
  // }
  private filterRestaurants(data, append) {
    if (!append) {
      this.restaurants = this.sortRestaurants(this.applyHaversine(data));
    } else {
      let moreRestaurants = this.sortRestaurants(this.applyHaversine(data));
      moreRestaurants.forEach((rest) => {
        this.restaurants.push(rest);
      });
    }
    this.addMarkers();
  }
  private sortRestaurants(restaurants) {
    return restaurants.sort((locationA, locationB) => {
      return locationA.distance - locationB.distance;
    });
  }
  private addMarkers() {
    console.log(this.restaurants);
    this.restaurants.forEach((restaurant) => {
      let marker = new google.maps.Marker({
        position: {
          lat: restaurant.geometry.location.lat(),
          lng: restaurant.geometry.location.lng()
        },
        map: this.map
      });
      this.infoWindow(restaurant, marker);
    });
  }
  private infoWindow(restaurant, marker) {
    let infoWindow = new google.maps.InfoWindow({
      content: `<p><b>${restaurant.name}</b></p></br>` +
      `<p>${restaurant.vicinity}</p></br>` +
      `<p>Rating: ${restaurant.rating}/5</p>`
    });
    marker.addListener('click', (e) => {
      infoWindow.open(this.map, marker);
      this.setDisplayRest(restaurant);
    });
    google.maps.event.addListener(infoWindow, 'closeclick', (e) => {
      this.toggleToListView();
    });
  }
  private setDisplayRest(rest) {
    this.displayRestInfo = true;
    this.displayRest = rest;
  }
  private applyHaversine(restaurants) {
    let usersLocation = {
      lat: this.currentLocation.latitude,
      lng: this.currentLocation.longitude
    };
    restaurants.map((restaurant) => {
      let placeLocation = {
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
  public toggleToListView(event?) {
    if (event) event.preventDefault();
    this.displayRestInfo = false;
    this.displayRest = null;
  }
  public enableSearch(event) {
    event.preventDefault();
    this.search = true;
  }
  public disableSearch(event) {
    event.preventDefault();
    this.search = false;
    this.moreRestaurantsToken = '';
    this.searchFor = '';
    this.getAllRestaurants();
  }
  private searchTerms(event) {
    event.preventDefault();
    if (this.searchFor == '' || this.searchFor == 'all') {
      this.getAllRestaurants();
    } else {
      this.getRestaurantsFromText();
    }
  }
  private getRestaurantsFromText() {
    let str = (this.searchFor + ' ' + this.currentLocation.location).split(' ').join('+');
    // let url = `${this.googleApiUrl}/place/textsearch/json?query=${str}` +
    //   `&key=${environment.googleApiKey}`;
    // return this.http.get(url)
    //   .map((res: any) => {
    //     if (res.json().next_page_token)
    //       this.moreRestaurantsToken = res.json().next_page_token;
    //     else this.moreRestaurantsToken = '';
    //     return res.json();
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //     return error;
    //   });
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
          console.log({results});
          this.filterRestaurants(results, false);
        }
        console.log({pagination});
        if(pagination.hasNextPage) {
          setTimeout(() => {
            pagination.nextPage();
          }, 2000);
        } else this.moreRestaurantsToken = '';
    });
  }
  // public getMoreRestaurants(infiniteScroll) {
  //   setTimeout(() => {
  //     let url: string = '';
  //     if (this.searchFor) {
  //       url = `${this.googleApiUrl}/place/textsearch/json?pagetoken=` +
  //         `${this.moreRestaurantsToken}&key=${environment.googleApiKey}`;
  //     } else {
  //       url = `${this.googleApiUrl}/place/nearbysearch/json?pagetoken=` +
  //         `${this.moreRestaurantsToken}&key=${environment.googleApiKey}`;
  //     }
  //     this.http.get(url)
  //       .toPromise()
  //       .then(res => {
  //         this.filterRestaurants(res.json(), true);
  //         if (res.json().next_page_token) this.moreRestaurantsToken = res.json().next_page_token;
  //         else this.moreRestaurantsToken = '';
  //         infiniteScroll.complete();
  //       });
  //   }, 2000);
  // }
  ngOnDestroy() {
    this.locationSubscription.unsubscribe();
  }
}