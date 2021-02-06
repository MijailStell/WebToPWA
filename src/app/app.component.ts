import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'web-to-pwa';

  constructor(private swUpdate: SwUpdate) {

  }

  ngOnInit(): void {
    this.reloadCache();
  }

  reloadCache(){
    if(this.swUpdate.isEnabled){
      this.swUpdate.available.subscribe(() =>{
        if(confirm('Hay una nueva versión disponible, ¿desea actualizar?')){
          window.location.reload();
        }
      })
    }
  }
}
