import path from 'path';
import multer from 'multer';

import createDebug from 'debug';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import sharp from 'sharp';
import { FireBase } from '../services/firebase.js';
const debug = createDebug('Final:FileMiddleware');

export class FileMiddleware {
  constructor() {
    debug('Instantiate');
  }

  singleFileStore(fileName = 'file', fileSize = 8_000_000_000) {
    const upload = multer({
      storage: multer.diskStorage({
        destination: 'public/uploads',
      }),
      limits: {
        fileSize,
      },
    });
    const middleware = upload.single(fileName);

    return (req: Request, res: Response, next: NextFunction) => {
      const previousBody = req.body;
      middleware(req, res, next);
      req.body = { ...previousBody, ...req.body };
    };
  }

  saveDataImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      debug('Called saveImage');
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable 2', 'Not valid image file');

      const userImage = req.file.filename;

      const fireBase = new FireBase();
      const FireBaseImage = await fireBase.uploadFile(userImage);

      req.body[req.file.fieldname] = {
        urlOriginal: req.file.originalname,
        url: FireBaseImage,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}
