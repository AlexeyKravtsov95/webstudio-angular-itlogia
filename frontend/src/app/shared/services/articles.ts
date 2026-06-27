import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleInterface, ArticlesInterface } from '../../interfaces/articles.interface';
import { environment } from '../../../environments/environment.development';
import { ActiveParamsInterface } from '../../interfaces/active-params.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private http: HttpClient = inject(HttpClient);

  getTopArticles(): Observable<ArticlesInterface[]> {
    return this.http.get<ArticlesInterface[]>(environment.api + 'articles/top');
  }

  getArticles(params: ActiveParamsInterface): Observable<ArticleInterface> {
    let httpParams = new HttpParams();
    if (params.page) {
      httpParams = httpParams.append('page', params.page);
    }

    params.categories.forEach(category => {
      httpParams = httpParams.append('categories', category);
    })
    return this.http.get<ArticleInterface>(environment.api + 'articles/', {
      params: httpParams,
    });
  }

  getArticle(url: string): Observable<ArticlesInterface> {
    return this.http.get<ArticlesInterface>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticlesInterface[]> {
    return this.http.get<ArticlesInterface[]>(environment.api + 'articles/related/' + url);
  }
}
