import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';

describe('BooksService', () => {
  let service: BooksService;
  let mockBookModel;

  beforeEach(async () => {
    // Simuler le modèle Book
    mockBookModel = {
      // Simuler la méthode `create` qui renvoie un livre
      create: jest.fn().mockResolvedValue({
        title: 'NestJS Book',
        author: 'John Doe',
        _id: '1',
      }),
      find: jest.fn().mockResolvedValue([]),
      findById: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      findByIdAndDelete: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getModelToken(Book.name), useValue: mockBookModel },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book successfully', async () => {
    const createBookDto = { title: 'NestJS Book', author: 'John Doe' };

    const result = await service.create(createBookDto);

    // Vérifier que la méthode `create` a été appelée avec les bons paramètres
    expect(mockBookModel.create).toHaveBeenCalledWith(createBookDto);
    // Vérifier que la création renvoie bien l'objet attendu
    expect(result).toEqual({
      title: 'NestJS Book',
      author: 'John Doe',
      _id: '1',
    });
  });
});
