import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RequestModalServices } from '../../services/request-modal-services';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private requestModalService: RequestModalServices = inject(RequestModalServices);

  openConsultation() {
    this.requestModalService.openConsultation();
  }

  protected readonly open = open;
}
