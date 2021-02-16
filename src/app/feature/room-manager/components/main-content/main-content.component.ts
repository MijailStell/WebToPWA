import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import videojs from 'video.js';
import 'videojs-youtube';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { SearchComponent } from 'src/app/shared/modals/search/search.component';
import { ChatService } from 'src/app/feature/room-manager/services/chat.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnDestroy, AfterViewInit {

  searchForm: FormGroup;
  videoUrl = 'https://www.youtube.com/watch?v=sem5xr_wezM';
  player: videojs.Player;
  roomName: string;
  playedSubscription: Subscription;
  pausedSubscription: Subscription;
  searchedSubscription: Subscription;

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private globalService: GlobalService,
              private chatService: ChatService) { }

  ngOnInit(): void {
    this.setForm();
    this.chatService.init();
    this.setSubscription();
    this.globalService.removeKeyStorage(Constantes.IsLocal);
    this.roomName = this.globalService.getValueKeyStorage(Constantes.RoomName);
  }

  ngAfterViewInit(): void {
    this.setPlayEvents();
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

  setSubscription(): void {
    this.playedSubscription = this.chatService.getPlayed$().subscribe(payload => {
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

    this.pausedSubscription = this.chatService.getPaused$().subscribe(() => {
      this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.False);
      this.player.pause();
    });

    this.searchedSubscription = this.chatService.getPlayItemSelected$().subscribe((url: string) => {
      this.player.poster('');
      this.player.src({ src: url, type: 'video/youtube' });
      this.player.currentTime(0);
      this.player.play();
    });
  }

  setPlayEvents(): void {
    this.player = videojs('myVideo', {sources: [{ src: `${this.videoUrl}`, type: 'video/youtube' }]});
    this.player.fluid();
    this.player.aspectRatio('5:2');

    this.player.on('ready', () => {
      this.player.on('ended', function () {
      });

      this.player.on('pause', () => {
          if (this.globalService.getValueKeyStorage(Constantes.IsLocal) == null) {
            this.chatService.pause();
          } else if (this.globalService.getValueKeyStorage(Constantes.IsLocal) === Constantes.True) {
            this.chatService.pause();
          }
          this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.True);
      });

      this.player.on('play', () => {
          if (this.globalService.getValueKeyStorage(Constantes.IsLocal) == null) {
            this.chatService.play({ url: this.player.currentSrc(), time: this.player.currentTime()});
          } else if (this.globalService.getValueKeyStorage(Constantes.IsLocal) === Constantes.True) {
            this.chatService.play({ url: this.player.currentSrc(), time: this.player.currentTime()});
          }
          this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.True);
      });
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
