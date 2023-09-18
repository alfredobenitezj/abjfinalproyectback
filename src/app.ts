import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { commentRouter } from './routers/comment.router.js';
import { userRouter } from './routers/userRouter.js';
import createDebug from 'debug';
import { errorHandler } from './middleware/error.js';
const corsOptions = {
  origin: '*',
};

const debug = createDebug('Pfinal AlfredoB');
export const app = express();
debug('Express modo on');

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.set('trust proxy', true);
app.get('/', (_req, res) => res.send('Api rest Info'));
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use(errorHandler);
