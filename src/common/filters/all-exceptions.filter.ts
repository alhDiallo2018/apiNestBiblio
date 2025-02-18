import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        response.status(status).json({
            statusCode: status,
            message: errorResponse['message'] || errorResponse,
            error: errorResponse['error'] || 'Internal Server Error',
            ...(errorResponse['details'] && { details: errorResponse['details'] }),
        });
    }
}
