import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { BannerSlide } from '../../interfaces/banner.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { OfferInterface } from '../../interfaces/offer.interface';
import { AboutInterface } from '../../interfaces/about.interface';
import { ABOUTS, BANNERS, OFFERS, REVIEWS } from './main.data';
import { ArticlesInterface } from '../../interfaces/articles.interface';
import { ArticlesService } from '../../shared/services/articles';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { ReviewsInterface } from '../../interfaces/reviews.interface';
import { RequestModalServices } from '../../shared/services/request-modal-services';

@Component({
  selector: 'app-main',
  imports: [
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ArticleCard,
    RouterLink,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };

  customReviewOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3,
      },
    },
    nav: true,
  };

  banners: BannerSlide[] = BANNERS;
  offers: OfferInterface[] = OFFERS;
  abouts: AboutInterface[] = ABOUTS;
  reviews: ReviewsInterface[] = REVIEWS;
  articles: WritableSignal<ArticlesInterface[]> = signal<ArticlesInterface[]>([]);

  private articlesService: ArticlesService = inject(ArticlesService);
  private requestModalService: RequestModalServices = inject(RequestModalServices);

  ngOnInit(): void {
    this.articlesService.getTopArticles().subscribe((data: ArticlesInterface[]) => {
      this.articles.set(data);
    });
  }

  openOrderPopup(service?: string): void {
    this.requestModalService.openOrder(
      service,
      this.offers.map((offer) => offer.title)
    );
  }
}
