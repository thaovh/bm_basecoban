import { ApiProperty } from '@nestjs/swagger';

export interface BaseResponse<T = any> {
    success: boolean;
    status_code: number;
    data?: T;
    meta?: Meta;
    error?: AppError;
}

export interface Meta {
    pagination?: Pagination;
    timestamp: string;
    request_id?: string;
    trace_id?: string;
}

export interface Pagination {
    limit: number;
    offset: number;
    total: number;
    has_next: boolean;
    has_prev: boolean;
}

export class AppError extends Error {
    constructor(
        public code: string,
        message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ResponseBuilder {
    static success<T>(data: T, statusCode: number = 200): BaseResponse<T> {
        return {
            success: true,
            status_code: statusCode,
            data,
            meta: {
                timestamp: new Date().toISOString(),
            },
        };
    }

    static error(error: AppError, statusCode: number): BaseResponse {
        return {
            success: false,
            status_code: statusCode,
            error,
            meta: {
                timestamp: new Date().toISOString(),
            },
        };
    }

    static paginated<T>(
        data: T[],
        total: number,
        limit: number,
        offset: number,
        statusCode: number = 200,
    ): BaseResponse<{ items: T[]; pagination: Pagination }> {
        const hasNext = offset + limit < total;
        const hasPrev = offset > 0;

        return {
            success: true,
            status_code: statusCode,
            data: {
                items: data,
                pagination: {
                    limit,
                    offset,
                    total,
                    has_next: hasNext,
                    has_prev: hasPrev,
                },
            },
            meta: {
                timestamp: new Date().toISOString(),
                pagination: {
                    limit,
                    offset,
                    total,
                    has_next: hasNext,
                    has_prev: hasPrev,
                },
            },
        };
    }
}

// HTTP Status Code Constants
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,
} as const;

export const HTTP_CLIENT_ERROR = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
} as const;

export const HTTP_SERVER_ERROR = {
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const;

// Error Code to Status Code Mapping
export const ERROR_CODE_TO_STATUS_MAP: Record<string, number> = {
    // 1xxx - System Errors -> 500
    'SYS_001': 500, // Internal system error
    'SYS_002': 504, // Request timeout
    'SYS_003': 503, // Service unavailable

    // 2xxx - Validation Errors -> 400/422
    'VAL_001': 400, // Required field missing
    'VAL_002': 422, // Invalid format
    'VAL_003': 422, // Value out of range

    // 3xxx - Authentication/Authorization -> 401/403
    'AUTH_001': 401, // Invalid token
    'AUTH_002': 401, // Token expired
    'AUTH_003': 403, // Insufficient permissions

    // 4xxx - Business Logic -> 404/409/422
    'BIZ_001': 404, // Resource not found
    'BIZ_002': 409, // Business rule conflict
    'BIZ_003': 422, // Business limit exceeded

    // 5xxx - External Dependencies -> 502/503/504
    'EXT_001': 504, // External service timeout
    'EXT_002': 503, // External service unavailable
    'EXT_003': 502, // External service error
};

export function getStatusFromErrorCode(errorCode: string): number {
    return ERROR_CODE_TO_STATUS_MAP[errorCode] || 500;
}
