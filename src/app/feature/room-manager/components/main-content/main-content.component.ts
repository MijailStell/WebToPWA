import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import videojs from 'video.js';
import 'videojs-youtube';
import * as io from 'socket.io-client';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { ActionEvent } from 'src/app/shared/enums/action-event';

import { SearchComponent } from 'src/app/shared/modals/search/search.component';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnDestroy, AfterViewInit {

  searchForm: FormGroup;
  chatForm: FormGroup;
  socketVideo: any;
  connectionId = '';
  isActive = true;
  videoUrl = 'https://www.youtube.com/watch?v=sem5xr_wezM';
  player: videojs.Player;
  eventbusVideSelectedSub: Subscription;
  roomName: string;

  constructor(private _formBuilder: FormBuilder,
              private eventBusService: EventBusService,
              public dialog: MatDialog,
              private globalService: GlobalService) { }

  ngOnInit(): void {
    this.setForm();
    this.setSocketListener();

    this.eventbusVideSelectedSub = this.eventBusService.on(ActionEvent.VideoSelected, ((url: string) => {
      this.player.poster('');
      this.player.src({ src: url, type: 'video/youtube' });
      this.player.currentTime(0);
      this.player.play();
    }));

    this.globalService.removeKeyStorage(Constantes.IsLocal);
    this.roomName = this.globalService.getValueKeyStorage(Constantes.RoomName);
  }

  ngAfterViewInit(): void {
    this.player = videojs('myVideo2', {sources: [{ src: `${this.videoUrl}`, type: 'video/youtube' }]});
    this.player.fluid();
    this.player.aspectRatio('5:2');

    this.player.on('ready', () => {
      this.player.on('ended', function () {
      });

      this.player.on('pause', () => {
          if (this.globalService.getValueKeyStorage(Constantes.IsLocal) == null) {
              this.socketVideo.emit('pause');
          } else if (this.globalService.getValueKeyStorage(Constantes.IsLocal) === Constantes.True) {
            this.socketVideo.emit('pause');
          }
          this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.True);
      });

      this.player.on('play', () => {
          if (this.globalService.getValueKeyStorage(Constantes.IsLocal) == null) {
            this.socketVideo.emit('play', { url: this.player.currentSrc(), time: this.player.currentTime()});
          } else if (this.globalService.getValueKeyStorage(Constantes.IsLocal) === Constantes.True) {
            this.socketVideo.emit('play', { url: this.player.currentSrc(), time: this.player.currentTime()});
          }
          this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.True);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  setForm(): void {
    this.searchForm = this._formBuilder.group({
      search: ['', Validators.required]
    });
    this.chatForm = this._formBuilder.group({
      message: ['', Validators.required]
    });
  }

  setSocketListener(): void {
    if(environment.production){
      this.socketVideo = io();
    } else {
      this.socketVideo = io(environment.urlBaseServiciosApi);
    }

    this.socketVideo.on('connect', () => {
      this.globalService.addKeyStorage(Constantes.ConnectionId, this.socketVideo.id);
      this.connectionId = this.socketVideo.id;
      this.socketVideo.emit('connected', {
        username: this.globalService.getValueKeyStorage(Constantes.Username),
        roomId: this.globalService.getValueKeyStorage(Constantes.RoomId),
        roomName: this.globalService.getValueKeyStorage(Constantes.RoomName)
      });
    });

	  // this.socketVideo.on('updatechat', (payload: any) => {
    //   console.log(JSON.stringify(payload));
    //   if(this.isActive && payload.username !== Constantes.Empty) {
    //     this.unreadMessages += 1;
    //   }
    //   if(payload.username === Constantes.Empty) {
    //     payload.username = 'Tú';
    //   }
    //   this.chatList.push(payload);

    //   setTimeout(() => {
    //     const scrollHeight = this.chatMessagesToScroll.nativeElement.scrollHeight;
    //     this.chatMessagesToScroll.nativeElement.scrollTop = scrollHeight + 170;
    //   }, 100);
	  // });

    this.socketVideo.on('played', (payload: any) => {
      this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.False);
        if (!this.globalService.getValueKeyStorage(Constantes.UrlVideo) ||
            (this.globalService.getValueKeyStorage(Constantes.UrlVideo) != payload.url)) {
              this.globalService.addKeyStorage(Constantes.UrlVideo, payload.url);
              this.player.poster('');
              this.player.src({ src: payload.url, type: 'video/youtube' });
        }
        this.player.currentTime(payload.time);
        this.player.play();
    });

    this.socketVideo.on('paused', () => {
      this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.False);
        this.player.pause();
    });
  }

  openDialogSearch(): void {
    if (this.searchForm.valid) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'custom-dialog';

      const dialogRef = this.dialog.open(SearchComponent, dialogConfig);
      dialogRef.componentInstance.searchText = this.searchForm.value.search;
    }
  }
}
