import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestModalDataInterface } from '../../interfaces/request-modal.interface';
import { RequestModal } from '../components/request-modal/request-modal';

@Injectable({
  providedIn: 'root',
})
export class RequestModalServices {
  private dialog = inject(MatDialog);

  private open(data: RequestModalDataInterface) {
    return this.dialog.open(RequestModal, {
      width: '727px',
      minHeight: '489px',
      maxWidth: 'none',
      panelClass: 'order-popup-dialog',
      backdropClass: 'order-popup-backdrop',
      autoFocus: false,
      data,
    });
  }

  openConsultation() {
    return this.open({
      mode: 'consultation',
      title: 'Закажите бесплатную консультацию!',
      submitLabel: 'Заказать консультацию',
    });
  }

  openOrder(service?: string, services?: string[]) {
    return this.open({
      mode: 'order',
      title: 'Заявка на услугу',
      submitLabel: 'Оставить заявку',
      service,
      services,
    });
  }
}
