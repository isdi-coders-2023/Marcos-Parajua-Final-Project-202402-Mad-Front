import { User } from './user';

export type ArticleCreateDto = {
  title: string;
  authorId: string;
  content?: string;
  avatar?: File;
  subtitle?: string;
};

export type Article = {
  id: string;
  title: string;
  subtitle?: string | undefined;
  avatar?: string | undefined;
  author: Partial<User>;
  authorId: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  maker: string;
};
export type ArticleUpdateDto = Partial<ArticleCreateDto>;
