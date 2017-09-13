import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../environments/environment';

import { AgmCoreModule } from '@agm/core';

import { SortablejsModule } from 'angular-sortablejs';

import { MyApp } from './app.component';
import { HomePage } from './home/home';
import { LoginPage } from './login/login';
import { RegistrationPage } from './registration/registration';
import { GroupsHistoryPage } from './groups/history/groups-history';
import { GroupsSetupPage } from './groups/setup/groups-setup';
import { GroupsQueuePage } from './groups/queue/queue';
import { MapPage } from './map/map';
import { HistoryPage } from './history/history';
import { MapExtension } from './map/map.directive';
import { ProfilePage } from './profile/profile';
import { PreferencesPage } from './preferences/preferences';
import { PreferencesPopover } from './preferences/preferences-popover/preferences-popover';
import { Nav } from './nav/nav';
import { Header } from './header/header';
import { SettingsPage } from './settings/settings';
import { FriendsPage } from './friends/friends';
import { FriendsList } from './friends/friends-list/friends-list';
import { Requests } from './friends/requests/requests';
import { Search } from './friends/search/search';
import { Suggestions } from './friends/suggestions/suggestions';

// modals
import { ChatModal } from './modals/chat-modal/chat-modal';
import { VetoExceededModal } from './modals/veto-exceeded-modal/veto-exceeded-modal';
import { Notifications } from './notifications/notifications';
import { ChangeLocationModal } from './modals/change-location-modal/change-location-modal';

import { CrudService } from './global-services/crud.service';
import { GeolocationService } from './global-services/geolocation.service';
import { AuthService } from './auth/auth.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegistrationPage,
    MapPage,
    HistoryPage,
    MapExtension,
    ProfilePage,
    Nav,
    GroupsHistoryPage,
    GroupsSetupPage,
    GroupsQueuePage,    
    Header,
    PreferencesPage,
    PreferencesPopover,
    SettingsPage,
    FriendsPage,
    FriendsList,
    Requests,
    Search,
    Suggestions,
    ChatModal,
    VetoExceededModal,
    Notifications,
    ChangeLocationModal
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    SortablejsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    NgbModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    HistoryPage,
    LoginPage,
    RegistrationPage,
    MapPage,
    ProfilePage,
    Nav,
    GroupsHistoryPage,
    GroupsSetupPage,
    GroupsQueuePage,
    Header,
    PreferencesPage,
    PreferencesPopover,
    SettingsPage,
    FriendsPage,
    FriendsList,
    Requests,
    Search,
    Suggestions,
    ChatModal,
    VetoExceededModal,
    Notifications,
    ChangeLocationModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CrudService,
    GeolocationService,
    Geolocation,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
