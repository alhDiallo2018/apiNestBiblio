import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../books/schemas/book.schema';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    ) {}

    async addReview(bookId: string, userId: string, comment: string, rating: number) {
        const book = await this.bookModel.findById(bookId);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        const existingReview = await this.reviewModel.findOne({ bookId, userId });
        if (existingReview) {
            throw new ForbiddenException('You have already reviewed this book');
        }

        const newReview = new this.reviewModel({
            comment,
            rating,
            userId,
            createdAt: new Date(),
        });
        await newReview.save();

        book.reviews.push(newReview._id);
        await book.save();

        return newReview;
    }

    async getReviews(bookId: string) {
        const book = await this.bookModel.findById(bookId).populate('reviews');
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book.reviews;
    }

    async updateReview(bookId: string, userId: string, comment: string, rating: number) {
        const review = await this.reviewModel.findOne({ bookId, userId });
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        review.comment = comment;
        review.rating = rating;
        review.createdAt = new Date();
        await review.save();

        return review;
    }

    async deleteReview(bookId: string, userId: string) {
        const review = await this.reviewModel.findOneAndDelete({ bookId, userId });
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        const book = await this.bookModel.findById(bookId);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        // book.reviews = book.reviews.filter(
        //     (reviewId) => reviewId.toString() !== review._id.toString(),
        // );
        await book.save();

        return { message: 'Review deleted successfully' };
    }

    async getTopRatedBooks(limit: number) {
        return this.reviewModel
            .aggregate([
                { $group: { _id: '$bookId', averageRating: { $avg: '$rating' } } },
                { $sort: { averageRating: -1 } },
                { $limit: limit },
            ])
            .exec();
    }
}
