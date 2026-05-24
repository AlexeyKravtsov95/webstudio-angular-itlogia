import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { BannerSlide } from '../../types/banner.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [CarouselModule, FormsModule, ReactiveFormsModule, NgStyle, MatDialogModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
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

  banners: BannerSlide[] = [
    {
      id: 1,
      category: 'Предложение месяца',
      title: [
        { text: 'Продвижение в Instagram для вашего бизнеса ' },
        { text: '-15%!', accent: true },
      ],
      image: './images/pages/main/banner1.png',
      imageDesc: 'Banner1',
    },
    {
      id: 2,
      category: 'Акция',
      title: [{ text: 'Нужен грамотный ' }, { text: 'копирайтер', accent: true }, { text: '?' }],
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: './images/pages/main/banner2.png',
      imageDesc: 'Banner2',
    },
    {
      id: 3,
      category: 'Новость дня',
      title: [{ text: '6 место', accent: true }, { text: ' в ТОП-10 SMM-агенств Москвы!' }],
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      image: './images/pages/main/banner3.png',
      imageDesc: 'Banner3',
    },
  ];

  offers = [
    {
      id: 1,
      image: './images/pages/main/offer1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
    },
    {
      id: 2,
      image: './images/pages/main/offer2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
    },
    {
      id: 3,
      image: './images/pages/main/offer3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
    },
    {
      id: 4,
      image: './images/pages/main/offer4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
    },
  ];

  @ViewChild('popup') popup!: TemplateRef<unknown>;
  fb: FormBuilder = inject(FormBuilder);
  dialogRef: MatDialogRef<any> | null = null;
  dialog: MatDialog = inject(MatDialog);
  router: Router = inject(Router);

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

  protected readonly close = close;
}
