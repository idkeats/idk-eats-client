import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, Content } from 'ionic-angular';

import { User } from '../../models/user';
import { Friend } from '../../models/friend';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';

@Component({
  selector: 'chat-modal',
  templateUrl: 'chat-modal.html'
})
export class ChatModal {
  invitedFriends: Friend[];
  myUser: User;
  messages: any;
  roomId: number;
  socket: any;
  message: string = '';

  @ViewChild(Content) 
  content: Content;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams) {
      this.invitedFriends = this.navParams.get('invitedFriends');
      this.myUser = this.navParams.get('myUser');
      this.roomId = this.navParams.get('roomId');

      this.socket= io.connect(environment.socketUrl);
      this.socket.on('connect', () => this.socket.emit('joinRoom', this.roomId));
      
      this.socket.on('disconnect', () => console.log('Client disconnected from socket'));
      this.socket.on('updateMessages', (message: string, user: User) => {
        this.messages.push({
          content: message,
          by: {
            user: user,
            owner: this.isOwner(user)
          }
        });
        this.scrollToBottom();
      });

      this.messages = [
        {
          content : "You know what this app needs?",
          by: {
            user: this.myUser,
            owner: true
          }
        },
        {
          content: "Don't say it..",
          by: {
            user: this.invitedFriends[0],
            owner: false
          }
        },
        {
          content: "Muffin Button",
          by: {
            user: this.myUser,
            owner: true
          }
        },
        {
          content: "I hate you..",
          by: {
            user: this.invitedFriends[0],
            owner: false
          }
        },
        {
          content: "Just Saiyan...",
          by: {
            user: this.myUser,
            owner: true
          }
        }
      ]
  }

  //scrolls to bottom whenever the page has loaded
  ionViewWillEnter(): void {
        this.scrollToBottom();
  }

  scrollToBottom() {
      setTimeout(() => {
          this.content.scrollToBottom();
      });
  }

  closeModal() {
    this.viewCtrl.dismiss();
    // Send Data back
    // this.viewCtrl.dismiss(userProvidedData);
  }

  sendMessage() {
    this.socket.emit('sendMessage', {message: this.message, roomId: this.roomId, user: this.myUser});
    this.message = '';
  }

  isOwner(user: User) {
    return this.myUser.id === user.id;
  }
}