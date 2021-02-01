import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Room } from 'src/app/shared/models/room';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  roomList: Room[]= [
    { id: 1, name: "Sala 001"},
    { id: 2, name: "Sala 002"},
    { id: 3, name: "Sala 003"}
  ];

  getRoomList() {
    return of(this.roomList);
  }
}
