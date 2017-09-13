import { Preference } from './preference';

export class User {
    public id: number;
    public name: string;
    public email: string;
    public preferences: Preference[];
    public friends: Object[];
    public my_friend_requests: any;
    public parties: Object[];
    public notifications: Object[];
    public pic: string;
    public zip: string;

    constructor() {
        this.id = null;
        this.name = '';
        this.email = '';
        this.preferences = [];
        this.friends = [];
        this.my_friend_requests = [];
        this.parties = [];
        this.notifications = [];
        this.pic = null;
        this.zip = null;
    }
}