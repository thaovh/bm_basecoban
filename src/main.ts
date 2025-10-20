import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { ResponseValidationInterceptor } from './common/interceptors/response-validation.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Security middleware
    app.use(helmet());
    app.use(compression());

    // Rate limiting
    app.use(
        rateLimit({
            windowMs: configService.get('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
            max: configService.get('RATE_LIMIT_MAX_REQUESTS', 100), // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later.',
        }),
    );

    // CORS configuration
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', '*'),
        credentials: configService.get('CORS_CREDENTIALS', true),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new ResponseValidationInterceptor(),
    );

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Bach Mai LIS Management System')
        .setDescription('Laboratory Information System API Documentation')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('Authentication', 'Authentication endpoints')
        .addTag('Users', 'User management endpoints')
        .addTag('Health', 'Health check endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    const port = configService.get('PORT', 3000);
    const host = configService.get('HOST', '0.0.0.0');
    await app.listen(port, host);

    // Get local IP address
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.')) {
                localIP = iface.address;
                break;
            }
        }
        if (localIP !== 'localhost') break;
    }

    logger.log(`🚀 Application is running on:`);
    logger.log(`   - Local: http://localhost:${port}`);
    logger.log(`   - Network: http://${localIP}:${port}`);
    logger.log(`   - All interfaces: http://0.0.0.0:${port}`);
    logger.log(`📚 Swagger documentation:`);
    logger.log(`   - Local: http://localhost:${port}/api/docs`);
    logger.log(`   - Network: http://${localIP}:${port}/api/docs`);
    logger.log(`🏥 Bach Mai LIS Management System v${configService.get('APP_VERSION', '1.0.0')}`);
}

bootstrap();
