import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Constantes } from 'src/app/shared/util/constantes';
import { EmitEvent } from 'src/app/shared/models/event-emit';
import { ActionEvent } from 'src/app/shared/enums/action-event';
import { GlobalService } from 'src/app/shared/services/global.service';
import { EventBusService } from 'src/app/shared/services/event-bus.service';
import { YoutubeService } from 'src/app/core/services/youtube.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ChatService } from 'src/app/feature/room-manager/services/chat.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchText: string;
  videos: any[] = [];
  private unsubscribe$: Subject<any> = new Subject();

  constructor(private dialogRef: MatDialogRef<SearchComponent>,
              public youtubeService: YoutubeService,
              private eventbus: EventBusService,
              private globalService: GlobalService,
              private messageService: MessageService,
              private chatService: ChatService){ }

  ngOnInit() {
    this.youtubeService.getVideos(this.searchText)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((responseModel: any) => {
      responseModel.items.forEach((element: any) => {
        this.videos.push(element);
      });
    });
  }

  selectedButton(video: any) {
    const eleccion = video.id.videoId;
    if (eleccion && eleccion.length > 0) {
        const url = `${Constantes.PathBaseYoutube}${eleccion}`;
        this.globalService.addKeyStorage(Constantes.IsLocal, Constantes.True);
        this.eventbus.emit(new EmitEvent(ActionEvent.VideoSelected, url));
        this.chatService.selectPlayItem(url);
    } else {
      this.messageService.showMessage({
        title: Constantes.Alerta,
        text: Constantes.VideoInvaido,
        icon: Constantes.AlertWarning
      });
    }
    this.dialogRef.close();
  }
}
