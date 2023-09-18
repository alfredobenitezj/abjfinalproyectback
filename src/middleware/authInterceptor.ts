/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import { AuthServices, PayLoadToken } from '../services/auth.js';
import { CommentRepo } from '../repository/comment.mongo.repository.js';
const debug = createDebug('FPAlfredoB Interceptor');
export class AuthInterceptor {
  // eslint-disable-next-line no-unused-vars
  constructor(protected commentRepo: CommentRepo) {
    debug('instanciated');
  }

  private getTokensFromHeader(req: Request): string {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new HttpError(401, 'Not Authorized', 'Not Authorization header');
    }

    if (!authHeader.startsWith('Bearer')) {
      throw new HttpError(
        401,
        'Not Authorized',
        'Not Bearer in Authorization header'
      );
    }
    return authHeader.slice(7);
  }

  logged(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new HttpError(401, 'Not Authorized', 'Not Authorization header');
      }

      if (!authHeader.startsWith('Bearer')) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }

      const token = authHeader.slice(7);
      const payload = AuthServices.verifyJWTGettingPayload(token);

      req.body.tokenPayload = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authorizedForComment(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }

      const tokenPayload = AuthServices.verifyJWTGettingPayload(
        token
      ) as PayLoadToken;

      if (!tokenPayload || !tokenPayload.id) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }
      const userId = tokenPayload.id;
      const commentId = req.params.id as string;
      const comment = await this.commentRepo.queryById(commentId);
      if (!comment) {
        throw new HttpError(404, 'Not found', 'Comment not found');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
