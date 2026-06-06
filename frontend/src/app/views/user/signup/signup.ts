import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { AuthService } from '../../../core/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultResponse } from '../../../types/default.interface';
import { LoginResponse } from '../../../types/login.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { UserServices } from '../../../shared/services/user-services';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  userService: UserServices = inject(UserServices);
  _matSnackBar: MatSnackBar = inject(MatSnackBar);

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    agree: ['', Validators.requiredTrue],
  });

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get agree() {
    return this.signupForm.get('agree');
  }

  signup() {
    const name = this.signupForm.value.name;
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    if (this.signupForm.valid && name && email && password) {
      this.authService.signup(name, email, password).subscribe({
        next: (data: DefaultResponse | LoginResponse) => {
          let error = null;
          if ((data as DefaultResponse).error !== undefined) {
            error = (data as DefaultResponse).message;
          }

          const loginResponse: LoginResponse = data as LoginResponse;
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = 'Ошибка регистрации';
          }

          if (error) {
            this._matSnackBar.open(error);
            throw new Error(error);
          }
          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;
          this._matSnackBar.open('Успешная регистрация');
          this.userService.getUserData();
          this.router.navigate(['/']).then();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._matSnackBar.open(errorResponse.error.message);
          } else {
            this._matSnackBar.open('Ошибка регистрации');
          }
        },
      });
    }
  }
}
