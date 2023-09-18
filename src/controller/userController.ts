import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthServices, PayLoadToken } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { LoginResponse } from '../types/response.api.js';
import createDebug from 'debug';
import { Controller } from './controller.js';
import { User } from '../entities/user.entity.js';

const debug = createDebug('Pfinal AlfredoB');
export class UserController extends Controller<User> {
  constructor(public repo: UserRepo) {
    super();
    debug('Mode on ');
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const passwd = await AuthServices.hash(req.body.passwd);
      req.body.passwd = passwd;
      res.status(201);
      res.send(await this.repo.create(req.body));
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.userName || !req.body.passwd) {
        throw new HttpError(
          400,
          'Mala request',
          'Usuario/contraseña no valido (1)'
        );
      }
      let data = await this.repo.search({
        key: 'userName',
        value: req.body.userName,
      });
      if (!data.length) {
        data = await this.repo.search({
          key: 'email',
          value: req.body.userName,
        });
      }

      if (
        !data.length ||
        !(await AuthServices.compare(req.body.passwd, data[0].passwd))
      ) {
        throw new HttpError(400, 'El user o la contraseña no es valida (2)');
      }
      const isUSerValid = await AuthServices.compare(
        req.body.passwd,
        data[0].passwd
      );
      if (!isUSerValid) {
        throw new HttpError(
          400,
          'Mala request',
          'usuario o contraseña no valido(3)'
        );
      }
      const payload: PayLoadToken = {
        id: data[0].id,
        userName: data[0].userName,
      };
      const token = AuthServices.createJWT(payload);
      const response: LoginResponse = {
        token,
        user: data[0],
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
