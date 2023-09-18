import { Router as createRouter } from 'express';
import createDebug from 'debug';
//import { User } from '../entities/user.entity.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { UserController } from '../controller/userController.js';
//import { Repo } from '../repository/repo.js';
import { FileMiddleware } from '../middleware/files.js';

const debug = createDebug('Pfinal AlfredoB');
debug('modo on ');

const repo: UserRepo = new UserRepo();
const controller = new UserController(repo);
export const userRouter = createRouter();
userRouter.get('/', controller.getAll.bind(controller));
userRouter.get('/id', controller.getAll.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
