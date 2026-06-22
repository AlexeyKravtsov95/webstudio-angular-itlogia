import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import { DefaultResponse } from '../../../interfaces/default.interface';
import { LoginResponse } from '../../../interfaces/login.interface';
import { AuthService } from '../../../core/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { UserServices } from '../../../shared/services/user-services';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgStyle, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService: AuthService = inject(AuthService);
  _matSnackBar: MatSnackBar = inject(MatSnackBar);
  userService: UserServices = inject(UserServices);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    rememberMe: [false],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService
        .login(
          this.loginForm.value.email,
          this.loginForm.value.password,
          !!this.loginForm.value.rememberMe,
        )
        .subscribe({
          next: (data: LoginResponse | DefaultResponse) => {
            let error = null;
            if ((data as DefaultResponse).error !== undefined) {
              error = (data as DefaultResponse).message;
            }

            const loginResponse = data as LoginResponse;
            if (
              !loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId
            ) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._matSnackBar.open(error);
              throw new Error(error);
            }
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._matSnackBar.open('Успешная авторизация');
            this.userService.getUserData();
            this.router.navigate(['/']).then();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._matSnackBar.open(errorResponse.error.message);
            } else {
              this._matSnackBar.open('Ошибка авторизации');
            }
          },
        });
    }
  }
}
