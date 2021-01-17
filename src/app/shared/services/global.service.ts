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

  getStoredUser(): string {
    return localStorage.getItem(Constantes.Usuario);
  }

  removeAuthorizationToken() {
    localStorage.removeItem(Constantes.Token);
    localStorage.removeItem(Constantes.Usuario);
  }

  addKeyStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getValueKeyStorage(key: string): string {
    return localStorage.getItem(key);
  }

  removeKeyStorage(key: string) {
    localStorage.removeItem(key);
  }
}
