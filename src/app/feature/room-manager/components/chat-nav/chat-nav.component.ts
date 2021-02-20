import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/feature/room-manager/services/chat.service';
import { Payload } from 'src/app/feature/room-manager/models/payload';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.scss']
})
export class ChatNavComponent implements OnInit {

  chatForm: FormGroup;
  messagesSubscription: Subscription;
  chatList: Payload[] = [];

  constructor(private _formBuilder: FormBuilder,
              private chatService: ChatService) { }

  ngOnInit(): void {
    this.setForm();
    this.setSubscription();
  }

  setForm(): void {
    this.chatForm = this._formBuilder.group({
      message: ['', Validators.required]
    });
  }

  setSubscription(): void {
    this.messagesSubscription = this.chatService.getMessages$().subscribe((messageList: Payload[]) => {
      console.log(JSON.stringify(messageList));
      this.chatList = messageList;
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
