import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Constantes } from 'src/app/shared/util/constantes';
import { GlobalService } from 'src/app/shared/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {
  constructor(
    public router: Router,
    public globalService: GlobalService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean {
    const logiStatus = this.globalService.getLoginStatus();
    if (!logiStatus) {
      this.router.navigate([Constantes.RutaAuth]);
      return false;
    }

    return true;
  }
}
