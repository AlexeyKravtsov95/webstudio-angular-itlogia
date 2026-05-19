import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  fb = inject(FormBuilder);
  router = inject(Router);

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', Validators.required],
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
      console.log("test")
    }
  }
}
