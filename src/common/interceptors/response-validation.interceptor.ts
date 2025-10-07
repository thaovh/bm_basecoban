import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseBuilder } from '../dtos/base-response.dto';

@Injectable()
export class ResponseValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // If the response is already in the correct format, return as is
                if (data && typeof data === 'object' && 'success' in data && 'status_code' in data) {
                    return data;
                }

                // If it's a simple success response, wrap it
                return ResponseBuilder.success(data);
            })
        );
    }
}
