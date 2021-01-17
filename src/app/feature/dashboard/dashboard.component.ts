import { Component, OnInit } from '@angular/core';
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
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
  }

  cerrarSesion() {
    this.globalService.removeAuthorizationToken();
    this.globalService.addKeyStorage(Constantes.PaginaRecargada, Constantes.Recargar);
    window.location.href = Constantes.RutaAuth;
  }

}
