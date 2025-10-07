import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class KongConsumerGuard implements CanActivate {
    private readonly logger = new Logger(KongConsumerGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        // Extract Kong headers (set by Kong JWT plugin)
        const kongRequestID = request.headers['x-kong-request-id'] as string;
        const kongConsumerID = request.headers['x-consumer-id'] as string;
        const kongConsumerUsername = request.headers['x-consumer-username'] as string;
        const kongConsumerCustomID = request.headers['x-consumer-custom-id'] as string;

        // Add to request context
        request['kong_request_id'] = kongRequestID;
        request['kong_consumer_id'] = kongConsumerID;
        request['kong_consumer_username'] = kongConsumerUsername;
        request['kong_consumer_custom_id'] = kongConsumerCustomID;

        // Log Kong-specific information
        this.logger.log('Kong authenticated request', {
            kong_request_id: kongRequestID,
            kong_consumer_id: kongConsumerID,
            kong_consumer_username: kongConsumerUsername,
            path: request.url,
            method: request.method,
        });

        return true;
    }
}
