import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { SubSink } from 'src/app/shared/util/sub-sink';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public isScreenSmall: boolean;
  isDarkTheme: boolean = false;
  dir: string = 'ltr';
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  roomName: string;
  subs = new SubSink();

  constructor(private globalService: GlobalService) { }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  toggleNav(): void {
    this.globalService.setNavStatus(!this.sidenav.opened);
    this.sidenav.toggle();
  }

  toggleDir() {
    this.dir = this.dir == 'ltr' ? 'rtl' : 'ltr';
  }

  ngOnInit(): void {
    this.subs.sink = this.globalService.getSmallScreen$().subscribe(isSmallScreem => {
      this.isScreenSmall = isSmallScreem;
    });
    this.roomName = this.globalService.getValueKeyStorage(Constantes.RoomName);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
