import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../src/authors/authors.service';
import { Author } from '../src/authors/schemas/author.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../src/books/schemas/book.schema';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorModel: any;
  let bookModel: any;

  const mockAuthor = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Author bio',
    birthDate: new Date('1990-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSave = jest.fn().mockResolvedValue(mockAuthor);

  function MockAuthorModel(this: any, dto: any) {
    Object.assign(this, dto);
    this.save = mockSave;
  }
  
  MockAuthorModel.create = jest.fn().mockResolvedValue(mockAuthor);
  MockAuthorModel.find = jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockAuthor]),
  });
  MockAuthorModel.findById = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockAuthor),
  });
  MockAuthorModel.findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockAuthor),
  });
  MockAuthorModel.findByIdAndUpdate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockAuthor),
  });
  MockAuthorModel.findByIdAndDelete = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockAuthor),
  });

  const mockBookModel = {
    countDocuments: jest.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: getModelToken('Author'), useValue: MockAuthorModel },
        { provide: getModelToken('Book'), useValue: mockBookModel },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorModel = module.get(getModelToken('Author'));
    bookModel = module.get(getModelToken('Book'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const authorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Author bio',
        birthDate: new Date('1990-01-01'),
      };
      const result = await service.create(authorDto);
      expect(result).toEqual(mockAuthor);
      expect(mockSave).toHaveBeenCalledWith();
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAuthor]);
      expect(authorModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single author', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockAuthor);
      expect(authorModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const updateDto = { bio: 'Updated bio' };
      const result = await service.update('1', updateDto);
      expect(result).toEqual(mockAuthor);
      expect(authorModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateDto, {
        new: true,
      });
    });
  });

  describe('remove', () => {
    it('should delete an author', async () => {
      await expect(service.remove('1')).resolves.toBeUndefined();
      expect(authorModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});