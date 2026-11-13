import { model, Schema } from 'mongoose';

interface User {
  username?: string;
  passwordHash?: string;
  isAnonymous: boolean;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const UserModel = model<User>('User', userSchema);