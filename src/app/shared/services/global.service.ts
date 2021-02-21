import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constantes } from 'src/app/shared/util/constantes';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private isSmallScreen$ = new BehaviorSubject<boolean>(false);
  private isNavStatus$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  public getSmallScreen$ = () => {
    return this.isSmallScreen$.asObservable();
  }

  public setSmallScreen = (value: boolean) => {
    this.isSmallScreen$.next(value);
  }

  public getNavStatus$ = () => {
    return this.isNavStatus$.asObservable();
  }

  public setNavStatus = (value: boolean) => {
    this.isNavStatus$.next(value);
  }

  guardarStorage(
    token: string,
    usuario: string
  ) {
    localStorage.setItem(Constantes.Token, token);
    localStorage.setItem(Constantes.Username, usuario);
  }

  getAuthorizationToken() {
    return localStorage.getItem(Constantes.Token);
  }

  getLoginStatus(): boolean{
    return Boolean(localStorage.getItem(Constantes.LoginStatus));
  }

  getStoredUser(): string {
    return localStorage.getItem(Constantes.Username);
  }

  removeAllKeys() {
    localStorage.clear();
  }

  addKeyStorage(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  getValueKeyStorage(key: string): any {
    return localStorage.getItem(key);
  }

  removeKeyStorage(key: string) {
    localStorage.removeItem(key);
  }
}
