import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '../books/schemas/book.schema';
import { ReviewService } from './review.service';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]), 
  ],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
