import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { DefaultResponse } from '../types/default.interface';
import { LoginResponse } from '../types/login.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';
  public isLogged$: Subject<boolean> = new Subject<boolean>();
  public isLogged: boolean = false;

  http: HttpClient = inject(HttpClient);

  constructor() {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  signup(
    name: string,
    email: string,
    password: string,
  ): Observable<DefaultResponse | LoginResponse> {
    return this.http.post<DefaultResponse | LoginResponse>(environment.api + 'signup', {
      name: name,
      email: email,
      password: password,
    });
  }

  login(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Observable<DefaultResponse | LoginResponse> {
    return this.http.post<DefaultResponse | LoginResponse>(environment.api + 'login', {
      email: email,
      password: password,
      rememberMe: rememberMe,
    });
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  public getTokens(): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  refresh(): Observable<DefaultResponse | LoginResponse> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponse>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken,
      });
    }
    throw throwError(() => 'Cant not refresh token');
  }

  logout(): Observable<DefaultResponse> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponse>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken,
      });
    }

    throw throwError(() => 'Cant not find token');
  }
}
