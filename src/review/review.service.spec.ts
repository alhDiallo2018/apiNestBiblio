import { ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Book } from '../books/schemas/book.schema';
import { ReviewService } from './review.service';
import { Review } from './schemas/review.schema';

const mockReview = {
    comment: 'Great book!',
    rating: 5,
    userId: '12345',
    bookId: 'book123',
    createdAt: new Date(),
    save: jest.fn().mockResolvedValue({
        comment: 'Great book!',
        rating: 5,
        userId: '12345',
        bookId: 'book123',
        createdAt: new Date(),
        _id: 'newReviewId',
    }),
};

const mockReviewModel = {
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn().mockResolvedValue({
        comment: 'Great book!',
        rating: 5,
        userId: '12345',
        bookId: 'book123',
        createdAt: new Date(),
        _id: 'newReviewId',
    }),
};

const mockBookModel = {
    findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({
            _id: 'book123',
            title: 'NestJS Book',
            author: 'John Doe',
            reviews: [],
        }),
        save: jest.fn().mockResolvedValue(true),
    }),
};

describe('ReviewService', () => {
    let reviewService: ReviewService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: getModelToken(Review.name),
                    useValue: mockReviewModel,
                },
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookModel,
                },
            ],
        }).compile();

        reviewService = module.get<ReviewService>(ReviewService);
    });

    it('should be defined', () => {
        expect(reviewService).toBeDefined();
    });

    it('should add a new review', async () => {
        mockReviewModel.findOne.mockResolvedValueOnce(null); // Simulate no existing review

        const result = await reviewService.addReview('book123', 'user123', 'Excellent book!', 5);

        expect(mockReviewModel.create).toHaveBeenCalledWith({
            comment: 'Excellent book!',
            rating: 5,
            userId: 'user123',
            createdAt: expect.any(Date),
        });
        expect(result).toEqual({
            comment: 'Excellent book!',
            rating: 5,
            userId: 'user123',
            createdAt: expect.any(Date),
            _id: 'newReviewId',
        });
    });

    it('should throw ForbiddenException if the user has already reviewed the book', async () => {
        mockReviewModel.findOne.mockResolvedValueOnce(mockReview); // Simulate existing review

        await expect(
            reviewService.addReview('book123', 'user123', 'Another review', 4),
        ).rejects.toThrow(ForbiddenException);
    });

    it('should retrieve reviews for a book', async () => {
        const result = await reviewService.getReviews('book123');

        expect(result).toEqual([]);
        expect(mockBookModel.findById).toHaveBeenCalledWith('book123');
    });

    it('should update an existing review', async () => {
        mockReviewModel.findOne.mockResolvedValueOnce(mockReview);

        const result = await reviewService.updateReview('book123', 'user123', 'Updated review!', 4);

        expect(mockReview.save).toHaveBeenCalled();
        expect(result).toEqual({
            ...mockReview,
            comment: 'Updated review!',
            rating: 4,
        });
    });

    it('should delete a review', async () => {
        mockReviewModel.findOneAndDelete.mockResolvedValueOnce(mockReview);

        const result = await reviewService.deleteReview('book123', 'user123');

        expect(mockReviewModel.findOneAndDelete).toHaveBeenCalledWith({
            bookId: 'book123',
            userId: 'user123',
        });
        expect(result).toEqual({ message: 'Review deleted successfully' });
    });
});
