import { User } from '../entities/user.entity.js';
export type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  items: { [key: string]: unknown }[];
};
export type LoginResponse = {
  token: string;
  user: User;
};
