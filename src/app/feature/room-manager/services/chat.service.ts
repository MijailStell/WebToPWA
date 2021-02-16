import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as io from 'socket.io-client';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { environment } from 'src/environments/environment';
import { Payload } from 'src/app/feature/room-manager/models/payload';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socketVideo: any;
  private unreadMessages: number = 0;
  private unreadMessages$ = new BehaviorSubject<number>(this.unreadMessages);
  private messages: any[] = [];
  private messages$ = new BehaviorSubject<any[]>(this.messages);
  private played$ = new Subject<Payload>();
  private paused$ = new Subject();
  private playItemSelected$ = new Subject<string>();

  constructor(private globalService: GlobalService) { }

  public init = () =>{
    if(this.socketVideo === undefined) {
      this.socketVideo = io(environment.urlBaseServiciosApi);

      this.socketVideo?.on('connect', () => {
        this.globalService.addKeyStorage(Constantes.ConnectionId, this.socketVideo.id);
        this.socketVideo?.emit('connected', {
          username: this.globalService.getValueKeyStorage(Constantes.Username),
          roomId: this.globalService.getValueKeyStorage(Constantes.RoomId),
          roomName: this.globalService.getValueKeyStorage(Constantes.RoomName)
        });
      });

      this.socketVideo?.on('updatechat', (payload: Payload) => {
        console.log(JSON.stringify(payload));
        if(payload.username !== Constantes.Empty) {
          this.unreadMessages += 1;
          this.unreadMessages$.next(this.unreadMessages)
        }
        if(payload.username === Constantes.Empty) {
          payload.username = 'Tú';
        }
        this.messages.push(payload);
        this.messages$.next(this.messages);
      });

      this.socketVideo?.on('played', (payload: Payload) => {
        this.played$.next(payload);
      });

      this.socketVideo?.on('paused', () => {
        this.paused$.next();
      });
    }
  }

  public getUnreadMessages$ = () => {
    return this.unreadMessages$.asObservable();
  }

  public getMessages$ = () => {
    return this.messages$.asObservable();
  }

  public getPlayed$ = () => {
    return this.played$.asObservable();
  }

  public getPaused$ = () => {
    return this.paused$.asObservable();
  }

  public getPlayItemSelected$ = () => {
    return this.playItemSelected$.asObservable();
  }

  public sendMessage = (message: any) => {
    this.socketVideo?.emit('sendchat', message);
  }

  public selectPlayItem = (url: string) => {
    this.playItemSelected$.next(url);
  }

  public leave = () => {
    this.socketVideo?.emit('leave', {
      username: this.globalService.getValueKeyStorage(Constantes.Username),
      roomName: this.globalService.getValueKeyStorage(Constantes.RoomName)
    });
  }

  public pause = () => {
    this.socketVideo.emit('pause');
  }

  public play = (payload: Payload) => {
    this.socketVideo.emit('play', { url: payload.url, time: payload.time});
  }
}
