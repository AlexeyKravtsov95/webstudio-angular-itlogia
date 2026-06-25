import { CommentInterface } from './comment.interface';

export interface ArticlesInterface {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  url: string;
  text?: string;
  comments?: CommentInterface[];
  commentsCount?: number;
}

export interface ArticleInterface {
  pages: number;
  items: ArticlesInterface[];
}
