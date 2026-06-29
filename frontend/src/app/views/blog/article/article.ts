import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ArticlesInterface } from '../../../interfaces/articles.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticlesService } from '../../../shared/services/articles';
import { environment } from '../../../../environments/environment.development';
import { ArticleCard } from '../../../shared/components/article-card/article-card';
import { Comments } from '../../../shared/components/comments/comments';

@Component({
  selector: 'app-article',
  imports: [RouterLink, ArticleCard, Comments],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article implements OnInit {
  private articlesServices: ArticlesService = inject(ArticlesService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  article: WritableSignal<ArticlesInterface>;
  relatedArticles: WritableSignal<ArticlesInterface[]> = signal<ArticlesInterface[]>([]);
  serverStaticPath: string = environment.serverStaticPath;

  constructor() {
    this.article = signal({
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: '',
      text: '',
      comments: [],
      commentsCount: 0,
    });
  }

  ngOnInit() {
    console.log('[Article] ngOnInit');
    this.activatedRoute.params.subscribe((params) => {
      console.log('[Article] route params:', params);
      this.articlesServices.getArticle(params['url']).subscribe((item) => {
        console.log('[Article] article loaded:', {
          id: item.id,
          url: item.url,
          commentsCount: item.commentsCount,
        });
        this.article.set(item);
      });
      this.articlesServices.getRelatedArticles(params['url']).subscribe((item) => {
        this.relatedArticles.set(item);
      });
    });
  }
}
