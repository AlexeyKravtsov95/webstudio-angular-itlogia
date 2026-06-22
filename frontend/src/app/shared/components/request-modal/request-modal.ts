import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestModalDataInterface, RequestPayload } from '../../../interfaces/request-modal.interface';
import { RequestServices } from '../../services/request-services';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-request-modal',
  imports: [ReactiveFormsModule, NgStyle],
  templateUrl: './request-modal.html',
  styleUrl: './request-modal.scss',
})
export class RequestModal implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private dialogRef: MatDialogRef<RequestModal> = inject(MatDialogRef<RequestModal>);
  private requestService: RequestServices = inject(RequestServices);
  data = inject<RequestModalDataInterface>(MAT_DIALOG_DATA);

  state = signal<'form' | 'success' | 'error'>('form');
  serverError = '';

  form = this.fb.group({
    service: [this.data.service ?? ''],
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*)*$/)]],
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/),
      ],
    ],
  });

  ngOnInit() {
    if (this.data.mode === 'order') {
      this.form.controls.service.setValidators(Validators.required);

      if (this.data.service) {
        this.form.patchValue({ service: this.data.service });
      }
    }

    this.form.controls.service.updateValueAndValidity();
  }

  get showService() {
    return this.data.mode === 'order';
  }

  get service() {
    return this.form.get('service');
  }

  get name() {
    return this.form.get('name');
  }
  get phone() {
    return this.form.get('phone');
  }

  submit() {
    this.serverError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, phone, service } = this.form.getRawValue();

    const payload: RequestPayload = {
      name: name!,
      phone: phone!,
      type: this.data.mode === 'order' ? 'order' : 'consultation',
    };

    if (this.data.mode === 'order' && service) {
      payload.service = service;
    }

    this.requestService.send(payload).subscribe({
      next: (response) => {
        if (response.error) {
          this.state.set('error');
          this.serverError = response.message;
          return;
        }
        this.state.set('success');
      },
      error: () => {
        this.state.set('error');
        this.serverError = 'Ошибка при отправке формы. Попробуйте еще раз';
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
