import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;
  let mockBooksService;

  beforeEach(async () => {
    // Mock du service BooksService
    mockBooksService = {
      create: jest.fn().mockResolvedValue({
        title: 'NestJS Book',
        author: 'John Doe',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: mockBooksService }, // Injecter le mock du service
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method from service when createBook is called', async () => {
    const createBookDto = { title: 'NestJS Book', author: 'John Doe' };

    // Appellons la méthode create du contrôleur
    const result = await controller.create(createBookDto);

    // Vérifions que le résultat correspond à la valeur renvoyée par le mock
    expect(result).toEqual({ title: 'NestJS Book', author: 'John Doe' });

    // Vérifions que la méthode create a été appelée avec le bon argument
    expect(mockBooksService.create).toHaveBeenCalledWith(createBookDto);
    expect(mockBooksService.create).toHaveBeenCalledTimes(1);
  });
});
