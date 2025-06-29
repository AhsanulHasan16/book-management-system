import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schemas/author.schema';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Book } from '@/books/schemas/book.schema';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel('Author') private authorModel: Model<Author>,
    @InjectModel('Book') private bookModel: Model<Book>
  ) { }

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const createdAuthor = new this.authorModel(createAuthorDto);
    return createdAuthor.save();
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<Author[]> {
    const query = search ? { $or: [{ firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') }] } : {};
    return this.authorModel.find(query).skip((page - 1) * limit).limit(limit).exec();
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorModel.findById(id).exec();
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorModel.findByIdAndUpdate(id, updateAuthorDto, { new: true }).exec();
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async remove(id: string): Promise<void> {
    const bookCount = await this.bookModel.countDocuments({ author: id });
    if (bookCount > 0) {
      throw new ConflictException('Cannot delete author with associated books.');
    }
    const result = await this.authorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }
}