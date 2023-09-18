import { Post } from './comment.entity.js';

export type User = {
  id: string;
  userName: string;
  passwd: string;
  email: string;
  Posts: Post[];
};
