import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/feature/room-manager/services/chat.service';
import { Payload } from 'src/app/feature/room-manager/models/payload';
import { SubSink } from 'src/app/shared/util/sub-sink';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatNavComponent implements OnInit, OnDestroy {

  chatForm: FormGroup;
  chatList: Payload[] = [];
  @ViewChild('chatMessages', { static: false }) chatMessagesToScroll: ElementRef;
  subs = new SubSink();

  constructor(private _formBuilder: FormBuilder,
              private chatService: ChatService) { }

  ngOnInit(): void {
    this.setForm();
    this.setSubscription();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setForm(): void {
    this.chatForm = this._formBuilder.group({
      message: ['', Validators.required]
    });
  }

  setSubscription(): void {
    this.subs.sink = this.chatService.getMessages$().subscribe((messageList: Payload[]) => {
      console.log(JSON.stringify(messageList));
      this.chatList = messageList;

      setTimeout(() => {
        const scrollHeight = this.chatMessagesToScroll.nativeElement.scrollHeight;
        this.chatMessagesToScroll.nativeElement.scrollTop = scrollHeight + 170;
        }, 100);
    });
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      this.chatForm.reset();
      this.chatService.sendMessage(message);
    }
  }

}
