import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookNotFoundException } from '../common/book-not-found.exception';
import { BookSearchException } from '../common/book-search.exception';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';

@Injectable()
export class BooksService {
    constructor(@InjectModel(Book.name) private readonly bookModel: Model<Book>) {}

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const newBook = new this.bookModel(createBookDto);
        return newBook.save();
    }

    async findAll(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }

    async findOne(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new BookNotFoundException(id);
        }
        return book;
    }

    async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
        if (!updatedBook) {
            throw new BookNotFoundException(id);
        }
        return updatedBook;
    }

    async remove(id: string): Promise<void> {
        const result = await this.bookModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new BookNotFoundException(id);
        }
    }

    async search(
        title: string,
        author: string,
        category: string,
        sortBy: string = 'publishedDate',
        sortOrder: string = 'asc'
    ): Promise<Book[]> {
        try {
            const query: any = {};

            if (title) query.title = { $regex: title, $options: 'i' };
            if (author) query.author = { $regex: author, $options: 'i' };
            if (category) query.category = { $regex: category, $options: 'i' };

            const sortOptions: any = {};
            if (['publishedDate', 'rating'].includes(sortBy)) {
                sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            } else {
                throw new BookSearchException(`Invalid sort field: ${sortBy}`);
            }

            return this.bookModel.find(query).sort(sortOptions).exec();
        } catch (error) {
            if (error instanceof BookSearchException) {
                throw error;
            }
            throw new BookSearchException('Error occurred during the search');
        }
    }
}
