import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticlesInterface } from '../../types/articles.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private http: HttpClient = inject(HttpClient);

  getTopArticles(): Observable<ArticlesInterface[]> {
    return this.http.get<ArticlesInterface[]>(environment.api + 'articles/top')
  }
}
