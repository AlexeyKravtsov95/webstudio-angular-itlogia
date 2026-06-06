import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderServices {
  isShowed$ = new Subject<boolean>();

  show() {
    this.isShowed$.next(true);
  }

  hide() {
    this.isShowed$.next(false);
  }
}
