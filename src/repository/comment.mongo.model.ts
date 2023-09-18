import { Schema, model } from 'mongoose';
import { Post } from '../entities/comment.entity.js';

const PostSchema = new Schema<Post>({
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: {
      urlOriginal: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      mimetype: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
      },
    },
    required: true,
  },
});

PostSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwd;
  },
});

export const PostModel = model('Post', PostSchema, 'comments');
