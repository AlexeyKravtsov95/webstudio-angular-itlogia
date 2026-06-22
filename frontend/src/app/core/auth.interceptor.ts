import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse } from '../interfaces/login.interface';
import { DefaultResponse } from '../interfaces/default.interface';
import { LoaderServices } from '../shared/services/loader-services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private loaderService: LoaderServices = inject(LoaderServices);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      });

      return next.handle(authReq).pipe(
        catchError((err) => {
          if (
            err.status === 401 &&
            !authReq.url.includes('/login') &&
            !authReq.url.includes('/refresh')
          ) {
            return this.handle401error(authReq, next);
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.loaderService.hide();
        }),
      );
    }

    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.hide();
      }),
    );
  }

  handle401error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh().pipe(
      switchMap((result) => {
        let error = '';
        if ((result as DefaultResponse).error !== undefined) {
          error = (result as DefaultResponse).message;
        }

        const refreshResult = result as LoginResponse;
        if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
          error = 'Ошибка автооризации';
        }

        if (error) {
          return throwError(() => new Error(error));
        }

        this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

        const authReq = req.clone({
          headers: req.headers.set('x-auth', refreshResult.accessToken),
        });

        return next.handle(authReq);
      }),
      catchError((err) => {
        this.authService.removeTokens();
        this.router.navigate(['/']).then();
        return throwError(() => err);
      }),
    );
  }
}
