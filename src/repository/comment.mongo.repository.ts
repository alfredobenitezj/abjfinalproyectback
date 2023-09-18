import { PostModel } from './comment.mongo.model.js';
import createDebug from 'debug';
import { Post } from '../entities/comment.entity.js';
import { Repo } from './repo.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('CommentsDebug');

export class CommentRepo implements Repo<Post> {
  constructor() {
    debug('Modo on', PostModel);
  }

  async query(page = 1, limit = 6, genre?: string): Promise<Post[]> {
    page = Number(page as any);
    limit = Number(limit as any);
    const queryObj = {} as any;
    return PostModel.find(queryObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner')
      .exec();
  }

  async queryById(id: string): Promise<Post> {
    const result = await PostModel.findById(id)
      .populate('owner', { comment: 0 })
      .exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the query');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Post[]> {
    const result = await PostModel.find({ [key]: value })
      .populate('owner', { comment: 0 })
      .exec(); //
    return result;
  }

  async create(data: Omit<Post, 'id'>): Promise<Post> {
    const newComment = await PostModel.create(data);
    return newComment;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const newComment = await PostModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate('owner', { comment: 0 })
      .exec();
    if (newComment === null)
      throw new HttpError(404, 'Not found', 'Invalid id for update');
    return newComment;
  }

  async delete(id: string): Promise<void> {
    const result = await PostModel.findByIdAndDelete(id).exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Invalid id for deletion');
  }
}
