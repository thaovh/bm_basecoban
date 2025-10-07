import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError, ResponseBuilder, getStatusFromErrorCode } from '../dtos/base-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let error: AppError;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as any;
                error = new AppError(
                    responseObj.code || 'HTTP_ERROR',
                    responseObj.message || exception.message,
                    responseObj.details
                );
            } else {
                error = new AppError('HTTP_ERROR', exception.message);
            }
        } else if (exception instanceof AppError) {
            status = getStatusFromErrorCode(exception.code);
            error = exception;
        } else {
            // Unknown error
            this.logger.error(`Unhandled exception: ${exception}`, (exception as Error)?.stack);
            error = new AppError('SYS_001', 'Internal server error');
        }

        // Log the error
        this.logger.error(
            `HTTP ${status} Error: ${error.message}`,
            {
                code: error.code,
                path: request.url,
                method: request.method,
                userAgent: request.get('User-Agent'),
                ip: request.ip,
                timestamp: new Date().toISOString(),
                stack: (exception as Error)?.stack,
            }
        );

        // Send error response
        const errorResponse = ResponseBuilder.error(error, status);
        response.status(status).json(errorResponse);
    }
}
