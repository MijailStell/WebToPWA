import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EmitEvent } from 'src/app/shared/models/event-emit';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  private subject$ = new Subject();

  on<T>(event: T, action: any): Subscription {
    return this.subject$
      .pipe(
        filter((e: EmitEvent) => {
          return e.name === event;
        }),
        map((e: EmitEvent) => {
          return e.value;
        })
      )
      .subscribe(action);
  }

  emit(event: EmitEvent): void {
    this.subject$.next(event);
  }
}
