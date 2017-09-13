import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';

import { FriendsList } from './friends-list/friends-list';
import { Requests } from './requests/requests';
import { Search } from './search/search';
import { Suggestions } from './suggestions/suggestions';


@Component({
    selector: 'freinds-page',
    templateUrl: 'friends.html'
})
export class FriendsPage {
    @ViewChild('tabs') tabsRef: Tabs;
    friendsList: any = FriendsList;
    requests: any = Requests;
    search: any = Search;
    suggestions: any = Suggestions;

    constructor(private navController: NavController) {}

    ngOnInit() { }

    navigateTabs(tabNumber: number) {
        if(this.navController.parent) {
            this.navController.parent.select(tabNumber);
        }
    }
}