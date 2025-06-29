import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Author } from '../../authors/schemas/author.schema';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true, unique: true })
  isbn!: string;

  @Prop()
  publishedDate?: Date;

  @Prop()
  genre?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true })
  author!: mongoose.Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);