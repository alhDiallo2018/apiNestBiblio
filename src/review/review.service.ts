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
        // Trouver le livre
        const book = await this.bookModel.findById(bookId);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        // Vérifier si l'utilisateur a déjà laissé une revue
        const existingReview = await this.reviewModel.findOne({ bookId, userId });
        if (existingReview) {
            throw new ForbiddenException('You have already reviewed this book');
        }

        // Créer la revue
        const newReview = await this.reviewModel.create({
            comment,
            rating,
            userId,
            createdAt: new Date(),
        });

        // Vérifier et initialiser `reviews` s'il est indéfini
        if (!book.reviews || !Array.isArray(book.reviews)) {
            book.reviews = [];
        }

        // Ajouter l'ID de la revue au tableau des revues du livre
        book.reviews.push(newReview._id as any);  // Cast explicite pour éviter l'erreur de type

        // Sauvegarder les changements dans le livre
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
        // Trouver et supprimer la revue
        const review = await this.reviewModel.findOneAndDelete({
            bookId,
            userId,
        });
    
        if (!review) {
            throw new ForbiddenException('Review not found');
        }
    
        // Supprimer l'ID de la revue des "reviews" du livre
        await this.bookModel.updateOne(
            { _id: bookId },
            { $pull: { reviews: review._id } }
        );
    
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
