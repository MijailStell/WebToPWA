import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { ChatService } from 'src/app/feature/room-manager/services/chat.service';
import { SubscriberService } from 'src/app/feature/room-manager/services/subscriber.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDir = new EventEmitter<void>();

  online$: Observable<boolean>;
  networkStatus: string;
  isActive = true;
  isLeft = true;
  unreadMessages$: Observable<number>;

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
    this.unreadMessages$ = this.chatService.getUnreadMessages$();
    this.subscriberService.init();
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
    this.isActive = !this.isActive;
    if(this.isActive) {
      this.unreadMessages$ = of(0);
    }
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
