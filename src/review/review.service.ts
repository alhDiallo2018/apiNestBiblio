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

    // Ajouter un avis
    async addReview(bookId: string, userId: string, comment: string, rating: number) {
        const book = await this.bookModel.findById(bookId);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        // Vérifier si l'utilisateur a déjà laissé un avis
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
        
        // Ajouter l'avis au livre, en utilisant le type correct pour `reviews`
        book.reviews.push(newReview._id);  // `push` fonctionne avec le bon type
        await book.save();

        return newReview;
    }

    // Obtenir les avis d'un livre
    async getReviews(bookId: string) {
        const book = await this.bookModel.findById(bookId).populate('reviews');
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book.reviews;
    }

    // Mettre à jour un avis
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

    // Supprimer un avis
    async deleteReview(bookId: string, userId: string) {
        const review = await this.reviewModel.findOneAndDelete({ bookId, userId });
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        const book = await this.bookModel.findById(bookId);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        // Retirer l'avis du livre
        book.reviews = book.reviews.filter((reviewId) => reviewId.toString() !== review._id.toString());
        await book.save();

        return { message: 'Review deleted successfully' };
    }
}
