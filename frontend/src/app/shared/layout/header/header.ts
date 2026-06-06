import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { UserServices } from '../../services/user-services';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink, MatMenuTrigger, MatMenu, MatMenuItem],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isLoggedIn: boolean = false;
  userName: WritableSignal<string> = signal<string>('');
  private authService: AuthService = inject(AuthService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private userService: UserServices = inject(UserServices);
  private router: Router = inject(Router);

  constructor() {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.userName.set(this.userService.getUserName());
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userService.userName$.subscribe((userName) => {
      this.userName.set(userName);
    });

    if (this.authService.getIsLoggedIn()) {
      this.userService.getUserData();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      }
    });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.userService.removeUserName();
    this.authService.userId = null;
    this._snackBar.open('Выход из системы');
    this.router.navigate(['/']).then();
  }
}
