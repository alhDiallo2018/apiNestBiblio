import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
    constructor() {
        super('Invalid credentials provided', HttpStatus.UNAUTHORIZED);
    }
}
