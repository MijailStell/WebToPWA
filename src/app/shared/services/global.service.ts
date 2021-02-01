import { Injectable } from '@angular/core';
import { Constantes } from 'src/app/shared/util/constantes';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  guardarStorage(
    token: string,
    usuario: string
  ) {
    localStorage.setItem(Constantes.Token, token);
    localStorage.setItem(Constantes.Usuario, usuario);
  }

  getAuthorizationToken() {
    return localStorage.getItem(Constantes.Token);
  }

  getLoginStatus(): boolean{
    return Boolean(localStorage.getItem(Constantes.LoginStatus));
  }

  getStoredUser(): string {
    return localStorage.getItem(Constantes.Usuario);
  }

  removeAuthorizationToken() {
    localStorage.removeItem(Constantes.Token);
    localStorage.removeItem(Constantes.Usuario);
    localStorage.removeItem(Constantes.RoomId);
    localStorage.removeItem(Constantes.RoomName);
    localStorage.removeItem(Constantes.LoginStatus);
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
