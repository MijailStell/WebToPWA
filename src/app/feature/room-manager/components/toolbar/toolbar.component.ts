import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { ChatService } from 'src/app/feature/room-manager/services/chat.service';
import { SubscriberService } from 'src/app/feature/room-manager/services/subscriber.service';
import { SubSink } from 'src/app/shared/util/sub-sink';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDir = new EventEmitter<void>();

  online$: Observable<boolean>;
  networkStatus: string;
  isActive: boolean = false;
  isLeft: boolean = true;
  unreadMessages$: Observable<number>;
  isVisibleUnread: boolean = false;
  subs = new SubSink();

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private globalService: GlobalService,
              private chatService: ChatService,
              private subscriberService: SubscriberService) {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
    this.setNetworkStatus();
  }

  ngOnInit(): void {
    this.subs.sink = this.globalService.getNavStatus$().subscribe(navStatus => {
      this.isActive = navStatus;
      if(this.isActive){
        this.unreadMessages$ = of(0);
        this.isVisibleUnread = false;
      }
    });
    this.subs.sink = this.chatService.getUnreadMessages$().subscribe(unreadCounter => {
      if(!this.isActive){
        this.unreadMessages$ = of(unreadCounter);
        this.isVisibleUnread = (unreadCounter !== 0);
      }
    });
    this.subscriberService.init();
    this.unreadMessages$ = of(0);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  setNetworkStatus(): void {
    this.online$.subscribe(value => {
      this.networkStatus = value ? Constantes.Empty : `(${Constantes.Offline})`;
      this.globalService.addKeyStorage(Constantes.NetworkStatus, value);
    });
  }

  sidenavToggle(): void{
    this.toggleSidenav.emit();
    this.globalService.setNavStatus(true);
    this.chatService.reInitUnreadMessage();
  }

  changeDirection() {
    this.toggleDir.emit();
    this.isLeft = !this.isLeft;
  }

  goToHome(): void {
    this.router.navigate([Constantes.RutaBase]);
  }

  cerrarSesion(): void {
    this.chatService.leave();
    this.globalService.removeAllKeys();
    this.router.navigate([Constantes.RutaAuth]);
  }

  subscriberTo(): void {
    this.subscriberService.subscriber();
  }

}
