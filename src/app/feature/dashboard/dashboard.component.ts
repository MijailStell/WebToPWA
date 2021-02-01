import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Constantes } from 'src/app/shared/util/constantes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isActive = true;
  username: string = this.globalService.getStoredUser();
  constructor(private globalService: GlobalService,
              private router: Router) { }

  ngOnInit() {
  }

  cerrarSesion() {
    this.globalService.removeAuthorizationToken();
    this.router.navigate([Constantes.RutaAuth]);
  }

}
