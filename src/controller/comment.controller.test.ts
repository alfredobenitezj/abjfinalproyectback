import { NextFunction, Request, Response } from 'express';
import { PostController } from './commentController.js';
import { CommentRepo } from '../repository/comment.mongo.repository.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { PostModel } from '../repository/comment.mongo.model.js';

describe('CommentController', () => {
  let mockCommentRepo: CommentRepo;
  let mockUserRepo: UserRepo;
  let controller: PostController;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    mockCommentRepo = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      queryById: jest.fn(),
    } as unknown as CommentRepo;

    mockUserRepo = {
      queryById: jest.fn(),
      update: jest.fn(),
    } as unknown as UserRepo;

    controller = new PostController(mockCommentRepo, mockUserRepo);

    req = {} as Request;
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  describe('createComment', () => {
    test('should throw an error', () => {
      expect(() => controller.create(req, res, next)).toThrow(
        'Method not implemented.'
      );
    });
  });

  describe('post', () => {
    beforeEach(() => {
      req.body = {
        tokenPayload: {
          id: 'user-id',
        },
      };
    });

    test('should create a new comment and update user', async () => {
      const mockUser = {
        id: 'user-id',
      };
      const mockNewComment = {
        id: 'comment-id',
        author: 'user-id',
      };

      (mockUserRepo.queryById as jest.Mock).mockResolvedValueOnce(mockUser);
      (mockCommentRepo.create as jest.Mock).mockResolvedValueOnce(
        mockNewComment
      );

      await controller.create(req, res, next);

      expect(mockUserRepo.queryById).toHaveBeenCalledWith('user-id');
      expect(mockCommentRepo.create).toHaveBeenCalledWith({
        author: 'user-id',
      });
      expect(mockUserRepo.update).toHaveBeenCalledWith('user-id', mockUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockNewComment);
    });

    test('should handle errors', async () => {
      const mockError = new Error('Test error');
      (mockUserRepo.queryById as jest.Mock).mockRejectedValueOnce(mockError);

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      req.params = {
        id: 'comment-id',
      };
      req.body = {
        tokenPayload: {
          id: 'user-id',
        },
        get: jest.fn().mockReturnValue('updated name'),
      };
    });

    test('should update the comment if user is authorized', async () => {
      const mockComment = {
        id: 'comment-id',
        author: 'user-id',
      };

      (PostModel.findById as jest.Mock).mockResolvedValueOnce(mockComment);
      (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        name: 'updated name',
      });

      await controller.patch(req, res, next);

      expect(PostModel.findById).toHaveBeenCalledWith('comment-id');
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'comment-id',
        { name: 'updated name' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ name: 'updated name' });
    });

    test('should return "Not authorized" if user is not authorized', async () => {
      const mockComment = {
        id: 'comment-id',
        author: 'other-user-id',
      };

      (PostModel.findById as jest.Mock).mockResolvedValueOnce(mockComment);

      await controller.patch(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
    });

    test('should handle errors', async () => {
      const mockError = new Error('Test error');
      (PostModel.findById as jest.Mock).mockRejectedValueOnce(mockError);

      await controller.patch(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteByid', () => {
    beforeEach(() => {
      req.params = {
        id: 'comment-id',
      };
      req.body = {
        tokenPayload: {
          id: 'user-id',
        },
      };
    });

    test('should delete the comment if user is authorized', async () => {
      const mockComment = {
        id: 'comment-id',
        author: 'user-id',
      };

      (PostModel.findById as jest.Mock).mockResolvedValueOnce(mockComment);
      (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(
        mockComment
      );

      await controller.deleteById(req, res, next);

      expect(PostModel.findById).toHaveBeenCalledWith('comment-id');
      expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith('comment-id');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockComment);
    });

    test('should return "Not authorized" if user is not authorized', async () => {
      const mockComment = {
        id: 'comment-id',
        author: 'other-user-id',
      };

      (PostModel.findById as jest.Mock).mockResolvedValueOnce(mockComment);

      await controller.deleteById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
    });

    test('should handle errors', async () => {
      const mockError = new Error('Test error');
      (PostModel.findById as jest.Mock).mockRejectedValueOnce(mockError);

      await controller.deleteById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
