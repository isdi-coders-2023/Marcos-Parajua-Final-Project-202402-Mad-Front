import { Article } from './article';

export type UserLoginDto = {
  name?: string;
  email?: string;
  password: string;
};

export type UserRegisterDto = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
  avatar: File;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  articles: Partial<Article[]>;
};
