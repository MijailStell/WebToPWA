import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import videojs from 'video.js';
import 'videojs-youtube';
import * as io from 'socket.io-client';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { ActionEvent } from 'src/app/shared/enums/action-event';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { SearchComponent } from 'src/app/shared/modals/search/search.component';
import { SwPush } from '@angular/service-worker';
import { SubscriptorService } from 'src/app/core/services/subscriptor.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  isActive = true;
  username: string = this.globalService.getStoredUser();
  searchForm: FormGroup;
  socketVideo: any;
  connectionId = '';
  videoUrl = 'https://www.youtube.com/watch?v=sem5xr_wezM';
  player: videojs.Player;
  eventbusVideSelectedSub: Subscription;
  online$: Observable<boolean>;
  networkStatus: string;
  roomName: string;
  readonly VAPID_PUBLIC_KEY = 'BAkNsj2kN7ZYEbdKHDJwvEhuaeT6GJB9FYRbPHEFYSBHxxy8Zm2-k9Xmcbv20Z3kYsOdmcIODe9yH4h4CtVRCBQ';

  constructor(private globalService: GlobalService,
              private router: Router,
              private _formBuilder: FormBuilder,
              private eventBusService: EventBusService,
              public dialog: MatDialog,
              private subscriptorService: SubscriptorService,
              private swPush: SwPush) {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
    this.setNetworkStatus();
  }

  ngOnInit(): void {
    this.setForm();
    this.setSocketListener();
    this.setPushConfig();

    this.eventbusVideSelectedSub = this.eventBusService.on(ActionEvent.VideoSelected, ((url: string) => {
      this.player.poster('');
      this.player.src({ src: url, type: 'video/youtube' });
      this.player.play();
    }));

    this.globalService.removeKeyStorage(Constantes.IsLocal);
    this.roomName = this.globalService.getValueKeyStorage(Constantes.RoomName);
    this.player = videojs('myVideo', {sources: [{ src: `${this.videoUrl}`, type: 'video/youtube' }]});
    this.player.fluid();
    this.player.aspectRatio('5:2');
  }

  ngAfterViewInit(): void {
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
  }

  setSocketListener(): void {
    this.socketVideo = io('http://localhost:4000');

    this.socketVideo.on('connect', () => {
      this.globalService.addKeyStorage(Constantes.ConnectionId, this.socketVideo.id);
      this.connectionId = this.socketVideo.id;
    });

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

  setPushConfig(): void {
    this.swPush.messages.subscribe((message) => {
      console.log('message => ' + JSON.stringify(message));
    });

    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('action => ' + JSON.stringify(action));
      console.log('notification => ' + JSON.stringify(notification));
      window.open(notification.data.url);
    });

    this.subscriberTo();
  }

  setNetworkStatus(): void {
    this.online$.subscribe(value => {
      this.networkStatus = value ? Constantes.Empty : `(${Constantes.Offline})`;
      this.globalService.addKeyStorage(Constantes.NetworkStatus, JSON.stringify(value));
    });
  }

  goToHome(): void {
    this.router.navigate([Constantes.RutaBase]);
  }

  cerrarSesion(): void {
    this.globalService.removeAllKeys();
    this.router.navigate([Constantes.RutaAuth]);
  }

  subscriberTo(): void {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        this.subscriptorService.subscribe(sub).subscribe();
        console.log(JSON.stringify(sub));
      })
      .catch(console.error);
    }
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
