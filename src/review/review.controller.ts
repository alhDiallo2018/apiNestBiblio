import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuardWithUserId } from '../auth/guards/jwt-auth-guard-with-user-id';
import { ReviewService } from './review.service';

@Controller('books')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    // Ajouter un avis à un livre
    @Post(':id/review')
    @UseGuards(JwtAuthGuardWithUserId) 
    async addReview(
        @Param('id') bookId: string,
        @Body() body: { comment: string; rating: number },
        @Request() req,
    ) {
        const userId = req.user.userId;
        return this.reviewService.addReview(bookId, userId, body.comment, body.rating);
    }

    // Obtenir les avis d'un livre
    @Get(':id/reviews')
    async getReviews(@Param('id') bookId: string) {
        return this.reviewService.getReviews(bookId);
    }

    // Mettre à jour un avis
    @Put(':id/review')
    @UseGuards(JwtAuthGuardWithUserId)
    async updateReview(
        @Param('id') bookId: string,
        @Body() body: { comment: string; rating: number },
        @Request() req,
    ) {
        const userId = req.user.userId;
        return this.reviewService.updateReview(bookId, userId, body.comment, body.rating);
    }

    // Supprimer un avis
    @Delete(':id/review')
    @UseGuards(JwtAuthGuardWithUserId)
    async deleteReview(@Param('id') bookId: string, @Request() req) {
        const userId = req.user.userId;
        return this.reviewService.deleteReview(bookId, userId);
    }
}
