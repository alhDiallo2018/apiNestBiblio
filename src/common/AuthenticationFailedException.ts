import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationFailedException extends HttpException {
    constructor() {
        super(
            {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Authentication failed. Please check your credentials.',
                error: 'Unauthorized',
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}
