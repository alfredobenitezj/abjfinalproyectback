import { NextFunction, Request, Response } from 'express';
import { Controller } from './controller.js';
import { Post } from '../entities/comment.entity.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { CommentRepo } from '../repository/comment.mongo.repository.js';
import { PayLoadToken } from '../services/auth.js';
export class PostController extends Controller<Post> {
  constructor(public repo: CommentRepo, protected userRepo: UserRepo) {
    super();
    this.repo = repo;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayLoadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;

      const newComment = await this.repo.create(req.body);
      user.Posts.push(newComment);
      await this.userRepo.update(user.id, user);
      res.status(201).send(newComment);
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedComment = await this.repo.update(req.params.id, req.body);
      res.send(updatedComment);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.repo.query();
      const response = {
        items,
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await this.repo.queryById(req.params.id);
      res.send(item);
    } catch (error) {
      next(error);
    }
  }
}
