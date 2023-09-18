import { Image } from '../types/imagen.js';
import { User } from './user.entity.js';

export type Post = {
  id: string;
  message: string;
  owner: User;
  image: Image;
};
