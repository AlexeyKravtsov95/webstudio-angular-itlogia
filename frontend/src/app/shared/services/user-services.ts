import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserInterface } from '../../interfaces/user.interface';
import { DefaultResponse } from '../../interfaces/default.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserServices {
  private http: HttpClient = inject(HttpClient);
  storageName: string = 'name';
  private userName = localStorage.getItem(this.storageName) ?? '';
  userName$: BehaviorSubject<string> = new BehaviorSubject<string>(this.userName);
  userInfo!: UserInterface;

  getUserInfo(): Observable<UserInterface | DefaultResponse> {
    return this.http.get<UserInterface | DefaultResponse>(environment.api + 'users');
  }

  getUserName(): string {
    return this.userName;
  }

  removeUserName() {
    localStorage.removeItem(this.storageName);
  }

  set userNameData(name: string | null) {
    if (name) {
      localStorage.setItem(this.storageName, name);
      this.userName = name;
      this.userName$.next(name);
    }
  }

  getUserData() {
    this.getUserInfo().subscribe({
      next: (data) => {
        if ((data as DefaultResponse).error !== undefined) return;
        this.userInfo = data as UserInterface;
        this.userNameData = this.userInfo.name;
      },
      error: (error) => {
        console.error('Failed to get user info', error);
      },
    });
  }
}
