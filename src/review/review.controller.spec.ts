import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  beforeEach(async () => {
    const mockReviewService = {
      addReview: jest.fn().mockResolvedValue({
        comment: 'Test',
        rating: 5,
        userId: 'user123',
        bookId: 'book123',
      }),
      findOne: jest.fn(),
      getReviews: jest.fn().mockResolvedValue([
        { comment: 'Great book!', rating: 5, userId: 'user123', bookId: 'book123' },
      ]),
      updateReview: jest.fn().mockResolvedValue({
        comment: 'Updated review!',
        rating: 4,
        userId: 'user123',
        bookId: 'book123',
      }),
      deleteReview: jest.fn().mockResolvedValue({
        comment: 'Great book!',
        rating: 5,
        userId: 'user123',
        bookId: 'book123',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a review', async () => {
    const mockRequest = { user: { userId: 'user123' } };
    const createReviewDto = {
      userId: 'user123',
      comment: 'Test',
      rating: 5,
    };
    const result = await controller.addReview('book123', createReviewDto, mockRequest);
    expect(result).toEqual({
      comment: 'Test',
      rating: 5,
      userId: 'user123',
      bookId: 'book123',
    });
    expect(service.addReview).toHaveBeenCalledWith('book123', 'user123', 'Test', 5);
  });

  it('should get reviews for a book', async () => {
    const result = await controller.getReviews('book123');
    expect(result).toEqual([
      { comment: 'Great book!', rating: 5, userId: 'user123', bookId: 'book123' },
    ]);
    expect(service.getReviews).toHaveBeenCalledWith('book123');
  });

  it('should update a review', async () => {
    const mockRequest = { user: { userId: 'user123' } };
    const updateReviewDto = { comment: 'Updated review!', rating: 4 };
    const result = await controller.updateReview('book123', updateReviewDto, mockRequest);
    expect(result).toEqual({
      comment: 'Updated review!',
      rating: 4,
      userId: 'user123',
      bookId: 'book123',
    });
    expect(service.updateReview).toHaveBeenCalledWith('book123', 'user123', 'Updated review!', 4);
  });

  it('should delete a review', async () => {
    const mockRequest = { user: { userId: 'user123' } };
    const result = await controller.deleteReview('book123', mockRequest);
    expect(result).toEqual({
      comment: 'Great book!',
      rating: 5,
      userId: 'user123',
      bookId: 'book123',
    });
    expect(service.deleteReview).toHaveBeenCalledWith('book123', 'user123');
  });
});
