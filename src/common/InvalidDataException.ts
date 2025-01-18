import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDataException extends HttpException {
    constructor(errors: string[]) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid data provided.',
                error: 'Bad Request',
                details: errors,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
