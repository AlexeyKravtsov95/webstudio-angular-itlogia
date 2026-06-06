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
import { BannerSlide } from '../../types/banner.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { OfferInterface } from '../../types/offer.interface';
import { AboutInterface } from '../../types/about.interface';
import { ABOUTS, BANNERS, OFFERS, REVIEWS } from './main.data';
import { ArticlesInterface } from '../../types/articles.interface';
import { ArticlesService } from '../../shared/services/articles';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { ReviewsInterface } from '../../types/reviews.interface';

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
    dots: true,
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
  fb: FormBuilder = inject(FormBuilder);
  dialogRef: MatDialogRef<any> | null = null;
  dialog: MatDialog = inject(MatDialog);
  router: Router = inject(Router);
  articlesService: ArticlesService = inject(ArticlesService);

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

  openOrderPopup(title?: string) {
    if (title) {
      this.orderForm.setValue({
        service: title ?? '',
        name: '',
        phone: '',
      });
    }

    this.dialogRef = this.dialog.open(this.popup, {
      width: '727px',
      minHeight: '489px',
      maxWidth: 'none',
      panelClass: 'order-popup-dialog',
      backdropClass: 'order-popup-backdrop',
      autoFocus: false,
    });
  }

  closePopup(): void {
    this.dialogRef?.close();
    this.router.navigate(['/']).then();
  }
}
