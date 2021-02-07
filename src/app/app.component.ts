import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ConfirmParameter } from 'src/app/shared/models/confirm-parameter';
import { Constantes } from 'src/app/shared/util/constantes';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private swUpdate: SwUpdate,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.reloadCache();
  }

  reloadCache(){
    if(this.swUpdate.isEnabled){
      this.swUpdate.available.subscribe(() =>{
        let confirmParameter: ConfirmParameter = {
          title: Constantes.ApplicationName,
          text: Constantes.HayUnaNuevaVersionDisponibleDeseaActualizar,
          icon: Constantes.AlertWarning
        };
        this.messageService.confirmMessage(confirmParameter).then(result => {
          if (result.value) {
            window.location.reload();
          }
        });
      })
    }
  }
}
