import { Router as createRouter } from 'express';
import createDebug from 'debug';

import { UserRepo } from '../repository/user.mongo.repository.js';

import { FileMiddleware } from '../middleware/files.js';
import { CommentRepo } from '../repository/comment.mongo.repository.js';
import { PostController } from '../controller/commentController.js';

import { AuthInterceptor } from '../middleware/authInterceptor.js';
const debug = createDebug('Pfinal AlfredoB');
debug('modo on ');
const repoUser: UserRepo = new UserRepo();
const repoComment: CommentRepo = new CommentRepo();
const auth = new AuthInterceptor(repoComment);
const controller = new PostController(repoComment, repoUser);
const fileStore = new FileMiddleware();
export const commentRouter = createRouter();
commentRouter.get('/', controller.getAll.bind(controller));
commentRouter.get('/:id', controller.getById.bind(controller));
commentRouter.post(
  '/',
  auth.logged.bind(auth),
  fileStore.singleFileStore('image').bind(fileStore),
  fileStore.saveDataImage.bind(fileStore),
  controller.create.bind(controller)
);
commentRouter.patch(
  '/:id',
  auth.logged.bind(auth),
  fileStore.singleFileStore('image').bind(fileStore),
  controller.patch.bind(controller)
);
commentRouter.delete(
  '/addcomment/:id',
  auth.logged.bind(auth),

  controller.deleteById.bind(controller)
);
