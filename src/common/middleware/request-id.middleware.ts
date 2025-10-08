import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Generate request ID if not present
        const requestId = req.headers['x-request-id'] as string || uuidv4();

        // Add request ID to headers
        req.headers['x-request-id'] = requestId;
        res.setHeader('x-request-id', requestId);

        // Add to request object for easy access
        req['requestId'] = requestId;

        // Generate trace ID for distributed tracing
        const traceId = req.headers['x-trace-id'] as string || uuidv4();
        req.headers['x-trace-id'] = traceId;
        res.setHeader('x-trace-id', traceId);
        req['traceId'] = traceId;

        next();
    }
}
