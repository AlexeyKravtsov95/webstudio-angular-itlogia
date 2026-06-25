import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryInterface } from '../../interfaces/category.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http: HttpClient = inject(HttpClient);

  getCategories(): Observable<CategoryInterface[]> {
    return this.http.get<CategoryInterface[]>(`${environment.api}categories`);
  }
}
