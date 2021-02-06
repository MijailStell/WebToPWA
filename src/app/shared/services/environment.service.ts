import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  public apiKey = '';
  public timeOutNotifications: number = 3000;

  constructor() {}
}
