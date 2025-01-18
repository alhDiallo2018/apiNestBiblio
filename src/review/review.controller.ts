import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardWithUserId } from '../auth/guards/jwt-auth-guard-with-user-id';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@ApiTags('review')
@Controller('books')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post(':id/review')
    @UseGuards(JwtAuthGuardWithUserId)
    @ApiResponse({ status: 201, description: 'Review added successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Invalid data provided.' })
    @ApiResponse({ status: 401, description: 'Unauthorized: Invalid or missing JWT token.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async addReview(
        @Param('id') bookId: string,
        @Body() createReviewDto: CreateReviewDto,
        @Request() req,
    ) {
        const userId = req.user.userId;
        const { comment, rating } = createReviewDto;
        return this.reviewService.addReview(bookId, userId, comment, rating);
    }

    @Get(':id/reviews')
    @ApiResponse({ status: 200, description: 'Reviews retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async getReviews(@Param('id') bookId: string) {
        return this.reviewService.getReviews(bookId);
    }

    @Put(':id/review')
    @UseGuards(JwtAuthGuardWithUserId)
    @ApiResponse({ status: 200, description: 'Review updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Invalid data provided.' })
    @ApiResponse({ status: 401, description: 'Unauthorized: Invalid or missing JWT token.' })
    @ApiResponse({ status: 404, description: 'Review or book not found.' })
    async updateReview(
        @Param('id') bookId: string,
        @Body() updateReviewDto: UpdateReviewDto,
        @Request() req,
    ) {
        const userId = req.user.userId;
        const { comment, rating } = updateReviewDto;
        return this.reviewService.updateReview(bookId, userId, comment, rating);
    }

    @Delete(':id/review')
    @UseGuards(JwtAuthGuardWithUserId)
    @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized: Invalid or missing JWT token.' })
    @ApiResponse({ status: 404, description: 'Review or book not found.' })
    async deleteReview(@Param('id') bookId: string, @Request() req) {
        const userId = req.user.userId;
        return this.reviewService.deleteReview(bookId, userId);
    }

    // Obtenir les livres les mieux notés
    @Get('top-rated')
    @ApiResponse({ status: 200, description: 'Top-rated books retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Invalid parameters.' })
    async getTopRatedBooks(@Query('limit') limit: number = 5) {
        return this.reviewService.getTopRatedBooks(limit);
    }
}
