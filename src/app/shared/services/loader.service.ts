import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isLoading$ = new BehaviorSubject<boolean>(false);

  public getIsLoading$ = () => {
    return this.isLoading$.asObservable();
  }

  show() {
      this.isLoading$.next(true);
  }

  hide() {
      this.isLoading$.next(false);
  }

}
