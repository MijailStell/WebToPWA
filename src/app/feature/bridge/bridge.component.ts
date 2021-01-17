import { Component, OnInit } from '@angular/core';
import { Constantes } from 'src/app/shared/util/constantes';

@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.scss']
})
export class BridgeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href = Constantes.RutaBase;
  }

}
