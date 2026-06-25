import {
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { BannerSlide } from '../../interfaces/banner.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
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
    NgStyle,
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

  @ViewChild('popup') popup!: TemplateRef<unknown>;
  private fb: FormBuilder = inject(FormBuilder);
  private dialogRef: MatDialogRef<any> | null = null;
  private router: Router = inject(Router);
  private articlesService: ArticlesService = inject(ArticlesService);
  private requestModalService: RequestModalServices = inject(RequestModalServices);

  orderForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*)*$/)]],
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/),
      ],
    ],
  });

  ngOnInit() {
    this.articlesService.getTopArticles().subscribe((data: ArticlesInterface[]) => {
      this.articles.set(data);
    });
  }

  get name() {
    return this.orderForm.get('name');
  }

  get phone() {
    return this.orderForm.get('phone');
  }

  openOrderPopup(service?: string) {
    this.requestModalService.openOrder(
      service,
      this.offers.map((offer) => offer.title)
    );
  }

  closePopup(): void {
    this.dialogRef?.close();
    this.router.navigate(['/']).then();
  }
}
