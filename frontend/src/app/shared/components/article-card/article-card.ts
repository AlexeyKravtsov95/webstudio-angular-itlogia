import { Component, Input } from '@angular/core';
import { ArticlesInterface } from '../../../interfaces/articles.interface';
import { environment } from '../../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
})
export class ArticleCard {
  @Input() article!: ArticlesInterface;
  serverStaticPath: string = environment.serverStaticPath;
}
