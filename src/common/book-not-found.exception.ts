import { HttpException, HttpStatus } from '@nestjs/common';

export class BookNotFoundException extends HttpException {
    constructor(bookId: string) {
        super(`Book with ID ${bookId} not found`, HttpStatus.NOT_FOUND);
    }
}