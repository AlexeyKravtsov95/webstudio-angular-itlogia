export interface BannerTitle {
  text: string;
  accent?: boolean;
}

export interface BannerSlide {
  id: number;
  category: string;
  title: BannerTitle[];
  text?: string;
  image: string;
  imageDesc: string;
  type: string;
}
