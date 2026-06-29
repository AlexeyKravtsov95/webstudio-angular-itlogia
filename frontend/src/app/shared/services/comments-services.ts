import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AllCommentInterface,
  CommentAction,
  UserCommentReactionInterface,
} from '../../interfaces/comment.interface';
import { DefaultResponseInterface } from '../../interfaces/default.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentsServices {
  private http: HttpClient = inject(HttpClient);

  getComments(
    articleId: string,
    offset: number,
  ): Observable<DefaultResponseInterface | AllCommentInterface> {
    const params = new HttpParams().set('article', articleId).set('offset', String(offset));
    return this.http.get<DefaultResponseInterface | AllCommentInterface>(
      `${environment.api}comments`,
      { params },
    );
  }

  addComment(articleId: string, text: string): Observable<DefaultResponseInterface> {
    return this.http.post<DefaultResponseInterface>(`${environment.api}comments`, {
      article: articleId,
      text,
    });
  }

  applyCommentAction(
    commentId: string,
    action: CommentAction,
  ): Observable<DefaultResponseInterface> {
    return this.http.post<DefaultResponseInterface>(
      `${environment.api}comments/${commentId}/apply-action`,
      { action },
    );
  }

  getArticleCommentActions(articleId: string): Observable<UserCommentReactionInterface[]> {
    const params = new HttpParams().set('articleId', articleId);
    return this.http.get<UserCommentReactionInterface[]>(
      `${environment.api}comments/article-comment-actions`,
      {
        params,
      },
    );
  }
}
