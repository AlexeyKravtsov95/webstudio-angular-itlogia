import { inject, Injectable } from '@angular/core';
import { RequestPayload } from '../../interfaces/request-modal.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponseInterface } from '../../interfaces/default.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RequestServices {
  private http: HttpClient = inject(HttpClient);

  send(payload: RequestPayload): Observable<DefaultResponseInterface> {
    return this.http.post<DefaultResponseInterface>(environment.api + 'requests', payload);
  }
}
