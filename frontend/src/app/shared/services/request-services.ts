import { inject, Injectable } from '@angular/core';
import { RequestPayload } from '../../types/request-modal.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../types/default.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RequestServices {
  private http: HttpClient = inject(HttpClient);

  send(payload: RequestPayload): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(environment.api + 'requests', payload);
  }
}
