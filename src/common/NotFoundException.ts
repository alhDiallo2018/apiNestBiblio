import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
    constructor(resource: string, id: string) {
        super(
            {
                statusCode: HttpStatus.NOT_FOUND,
                message: `${resource} with ID ${id} not found.`,
                error: 'Not Found',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
