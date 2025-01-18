import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CommonModule } from './common/common.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { UsersModule } from './users/users.module';



@Module({
  imports: [BooksModule, UsersModule, AuthModule, CommonModule,MongooseModule.forRoot(process.env.MONGODB_URI), ReviewModule],
  controllers: [AppController, ReviewController],
  providers: [AppService],
})
export class AppModule {}
