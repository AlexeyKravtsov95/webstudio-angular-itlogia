import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { BannerSlide } from '../../types/banner.interface';

@Component({
  selector: 'app-main',
  imports: [CarouselModule],
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
    navText: [
      '',
      '',
    ],
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
}
