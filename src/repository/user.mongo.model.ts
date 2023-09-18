import { Schema, model } from 'mongoose';
import { User } from '../entities/user.entity.js';
import { PostModel } from './comment.mongo.model.js';
const userSchema = new Schema<User>({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
    unique: true,
  },
  Posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwd;
  },
});
export const UserModel = model('User', userSchema, 'users');
