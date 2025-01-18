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
    _id: 'newReviewId',  
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
    updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),  
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
        mockReviewModel.findOne.mockResolvedValueOnce(null); 
        
        const result = await reviewService.addReview('book123', '12345', 'Great book!', 5);
        
        expect(mockReviewModel.create).toHaveBeenCalledWith({
            comment: 'Great book!',
            rating: 5,
            userId: '12345',
            createdAt: expect.any(Date),
        });
        expect(result).toEqual({
            comment: 'Great book!',  
            rating: 5,
            userId: '12345',  
            createdAt: expect.any(Date),
            _id: 'newReviewId',
            bookId: 'book123',
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
        mockBookModel.updateOne.mockResolvedValue({ nModified: 1 });
        
        // Vérifiez que la méthode de suppression et la mise à jour sont appelées correctement
        const result = await reviewService.deleteReview('book123', '12345');
        
        // Vérifiez que findOneAndDelete a bien été appelée avec les bons paramètres
        expect(mockReviewModel.findOneAndDelete).toHaveBeenCalledWith({
            bookId: 'book123',
            userId: '12345',
        });
    
        // Vérifiez que updateOne a été appelée avec le bon ID de la revue
        expect(mockBookModel.updateOne).toHaveBeenCalledWith(
            { _id: 'book123' },
            { $pull: { reviews: 'newReviewId' } }  
        );
    
        // Vérifiez la réponse de la suppression
        expect(result).toEqual({ message: 'Review deleted successfully' });
    });
    
    
    
    
});
