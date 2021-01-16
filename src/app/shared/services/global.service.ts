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

  removeAuthorizationToken() {
    localStorage.removeItem(Constantes.Token);
    localStorage.removeItem(Constantes.Usuario);
  }
}
