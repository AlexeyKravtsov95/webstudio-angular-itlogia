import { BannerSlide } from '../../types/banner.interface';
import { OfferInterface } from '../../types/offer.interface';
import { AboutInterface } from '../../types/about.interface';

export const BANNERS: BannerSlide[] = [
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

export const OFFERS: OfferInterface[] = [
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

export const ABOUTS: AboutInterface[] = [
  {
    id: 1,
    accentText: 'Мастерски вовлекаем аудиторию в процесс. ',
    text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.',
  },
  {
    id: 2,
    accentText: 'Разрабатываем бомбическую визуальную концепцию. ',
    text: 'Наши специалисты знают как создать уникальный образ вашего проекта.',
  },
  {
    id: 3,
    accentText: 'Создаём мощные воронки с помощью текстов. ',
    text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.',
  },
  {
    id: 4,
    accentText: 'Помогаем продавать больше. ',
    text: 'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.',
  },
];
