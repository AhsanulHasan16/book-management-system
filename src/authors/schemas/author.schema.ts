import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Author extends Document {
  firstName: string;
  lastName: string;
  bio?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const AuthorSchema = new mongoose.Schema<Author>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String, required: false },
  birthDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});