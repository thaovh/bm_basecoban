import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProvinceModule } from './modules/province/province.module';
import { WardModule } from './modules/ward/ward.module';
import { BranchModule } from './modules/branch/branch.module';
import { DepartmentTypeModule } from './modules/department-type/department-type.module';
import { DepartmentModule } from './modules/department/department.module';
import { RoomModule } from './modules/room/room.module';
import { typeOrmConfig } from './infrastructure/database/typeorm.config';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),

        // Database
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => typeOrmConfig(configService),
            inject: [ConfigService],
        }),

        // CQRS
        CqrsModule.forRoot(),

        // Health checks
        TerminusModule,

        // Feature modules
        UserModule,
        AuthModule,
        ProvinceModule,
        WardModule,
        BranchModule,
        DepartmentTypeModule,
        DepartmentModule,
        RoomModule,
    ],
    controllers: [HealthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestIdMiddleware)
            .forRoutes('*');
    }
}
